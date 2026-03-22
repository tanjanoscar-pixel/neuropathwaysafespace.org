from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import os
import logging
import uuid
import jwt
import asyncio
import resend
from emergentintegrations.llm.chat import LlmChat, UserMessage
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from io import BytesIO
import base64
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Resend setup
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# AI setup
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Create the main app
app = FastAPI()

# Create API router
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ==================== MODELS ====================

class UserRole:
    PROFESSIONAL = "professional"
    EDUCATION = "education"
    YOUTH = "youth"


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    full_name: str
    role: str  # professional, education, youth
    age: Optional[int] = None  # For youth users
    organization: Optional[str] = None  # For professional/education
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    consent_given: bool = False  # GDPR consent


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str
    age: Optional[int] = None
    organization: Optional[str] = None
    consent_given: bool


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class QuestionnaireResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    questionnaire_type: str  # mood, behavior, crisis, assessment
    responses: Dict[str, Any]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ai_analysis: Optional[str] = None


class QuestionnaireSubmit(BaseModel):
    questionnaire_type: str
    responses: Dict[str, Any]


class Evidence(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    evidence_type: str  # observation, assessment, incident, progress
    description: str
    date: datetime
    recorded_by: str
    severity: Optional[str] = None  # red, amber, green
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EvidenceCreate(BaseModel):
    evidence_type: str
    description: str
    date: datetime
    recorded_by: str
    severity: Optional[str] = None


class EHCP(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    child_name: str
    generated_content: str
    pdf_base64: Optional[str] = None
    evidence_summary: List[Dict[str, Any]]
    assessment_summary: Dict[str, Any]
    recommendations: List[str]
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EmotionalSupportRequest(BaseModel):
    message: str
    mood: Optional[str] = None


class EmotionalSupportResponse(BaseModel):
    response: str
    resources: List[str]
    crisis_level: str  # low, medium, high


# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_jwt_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def send_email_async(recipient: str, subject: str, html_content: str):
    """Send email using Resend"""
    params = {
        "from": SENDER_EMAIL,
        "to": [recipient],
        "subject": subject,
        "html": html_content
    }
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {recipient}: {email.get('id')}")
        return email
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise


async def analyze_with_ai(text: str, context: str = "general") -> str:
    """Use Claude Sonnet 4.5 for AI analysis"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message="""You are a compassionate mental health support assistant for the NeuroPathway Safe Space platform, 
            specializing in neurodivergent children ages 8-17. You provide evidence-based emotional support, 
            identify behavior patterns, and suggest appropriate interventions. You are GDPR compliant and prioritize child safety."""
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        user_message = UserMessage(text=text)
        response = await chat.send_message(user_message)
        return response
    except Exception as e:
        logger.error(f"AI analysis failed: {str(e)}")
        return "AI analysis temporarily unavailable. Please contact support."


def generate_ehcp_pdf(ehcp_data: Dict[str, Any]) -> str:
    """Generate EHCP PDF and return base64 encoded string"""
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(1*inch, height - 1*inch, "Education, Health and Care Plan (EHCP)")
    
    # Child information
    c.setFont("Helvetica-Bold", 12)
    c.drawString(1*inch, height - 1.5*inch, "Child Information:")
    c.setFont("Helvetica", 10)
    c.drawString(1*inch, height - 1.8*inch, f"Name: {ehcp_data.get('child_name', 'N/A')}")
    c.drawString(1*inch, height - 2.0*inch, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    
    # Evidence Summary
    y_pos = height - 2.5*inch
    c.setFont("Helvetica-Bold", 12)
    c.drawString(1*inch, y_pos, "Evidence Summary:")
    y_pos -= 0.3*inch
    
    c.setFont("Helvetica", 9)
    for evidence in ehcp_data.get('evidence_summary', [])[:5]:
        if y_pos < 2*inch:
            c.showPage()
            y_pos = height - 1*inch
        c.drawString(1.2*inch, y_pos, f"• {evidence.get('description', '')[:80]}")
        y_pos -= 0.2*inch
    
    # Recommendations
    y_pos -= 0.3*inch
    c.setFont("Helvetica-Bold", 12)
    c.drawString(1*inch, y_pos, "Recommendations:")
    y_pos -= 0.3*inch
    
    c.setFont("Helvetica", 9)
    for rec in ehcp_data.get('recommendations', []):
        if y_pos < 2*inch:
            c.showPage()
            y_pos = height - 1*inch
        c.drawString(1.2*inch, y_pos, f"• {rec}")
        y_pos -= 0.2*inch
    
    c.save()
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return base64.b64encode(pdf_bytes).decode('utf-8')


# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "NeuroPathway Safe Space API"}


# Authentication Routes
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate role
    if user_data.role not in [UserRole.PROFESSIONAL, UserRole.EDUCATION, UserRole.YOUTH]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    # Check GDPR consent
    if not user_data.consent_given:
        raise HTTPException(status_code=400, detail="GDPR consent required")
    
    # Create user
    user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        full_name=user_data.full_name,
        role=user_data.role,
        age=user_data.age,
        organization=user_data.organization,
        consent_given=user_data.consent_given
    )
    
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    await db.users.insert_one(user_dict)
    
    # Create token
    token = create_jwt_token(user.id, user.email, user.role)
    
    # Send welcome email
    try:
        html_content = f"""
        <h2>Welcome to NeuroPathway Safe Space!</h2>
        <p>Hi {user.full_name},</p>
        <p>Your account has been successfully created as a {user.role} user.</p>
        <p>You can now log in and start using the platform.</p>
        <p><strong>Prevention Is the Cure - Small Steps Create Big Change</strong></p>
        """
        await send_email_async(user.email, "Welcome to NeuroPathway Safe Space", html_content)
    except Exception as e:
        logger.error(f"Welcome email failed: {e}")
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }


@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token(user["id"], user["email"], user["role"])
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"]
        }
    }


@api_router.get("/auth/me")
async def get_me(current_user: Dict = Depends(get_current_user)):
    return current_user


# Contact Form
@api_router.post("/contact")
async def submit_contact_form(form: ContactForm):
    try:
        # Store in database
        form_dict = form.model_dump()
        form_dict['id'] = str(uuid.uuid4())
        form_dict['submitted_at'] = datetime.now(timezone.utc).isoformat()
        await db.contact_forms.insert_one(form_dict)
        
        # Send email notification
        html_content = f"""
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {form.name}</p>
        <p><strong>Email:</strong> {form.email}</p>
        <p><strong>Subject:</strong> {form.subject}</p>
        <p><strong>Message:</strong></p>
        <p>{form.message}</p>
        """
        await send_email_async(SENDER_EMAIL, f"Contact Form: {form.subject}", html_content)
        
        return {"status": "success", "message": "Contact form submitted successfully"}
    except Exception as e:
        logger.error(f"Contact form error: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit contact form")


# Questionnaire Routes
@api_router.post("/questionnaires/submit")
async def submit_questionnaire(
    submission: QuestionnaireSubmit,
    current_user: Dict = Depends(get_current_user)
):
    try:
        # Create questionnaire response
        response = QuestionnaireResponse(
            user_id=current_user["id"],
            questionnaire_type=submission.questionnaire_type,
            responses=submission.responses
        )
        
        # AI analysis of responses
        analysis_text = f"Analyze this {submission.questionnaire_type} questionnaire response and identify patterns, concerns, and recommendations: {submission.responses}"
        ai_analysis = await analyze_with_ai(analysis_text, context="questionnaire_analysis")
        response.ai_analysis = ai_analysis
        
        # Store in database
        response_dict = response.model_dump()
        response_dict['timestamp'] = response_dict['timestamp'].isoformat()
        await db.questionnaires.insert_one(response_dict)
        
        return {
            "status": "success",
            "message": "Questionnaire submitted successfully",
            "analysis": ai_analysis
        }
    except Exception as e:
        logger.error(f"Questionnaire submission error: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit questionnaire")


@api_router.get("/questionnaires/history")
async def get_questionnaire_history(current_user: Dict = Depends(get_current_user)):
    questionnaires = await db.questionnaires.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("timestamp", -1).to_list(100)
    
    for q in questionnaires:
        if isinstance(q.get('timestamp'), str):
            q['timestamp'] = datetime.fromisoformat(q['timestamp'])
    
    return questionnaires


# Evidence Collection
@api_router.post("/evidence/add")
async def add_evidence(
    evidence_data: EvidenceCreate,
    current_user: Dict = Depends(get_current_user)
):
    # Only professionals and education staff can add evidence
    if current_user["role"] not in [UserRole.PROFESSIONAL, UserRole.EDUCATION]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    evidence = Evidence(
        user_id=current_user["id"],
        evidence_type=evidence_data.evidence_type,
        description=evidence_data.description,
        date=evidence_data.date,
        recorded_by=evidence_data.recorded_by,
        severity=evidence_data.severity
    )
    
    evidence_dict = evidence.model_dump()
    evidence_dict['date'] = evidence_dict['date'].isoformat()
    evidence_dict['created_at'] = evidence_dict['created_at'].isoformat()
    await db.evidence.insert_one(evidence_dict)
    
    return {"status": "success", "evidence_id": evidence.id}


@api_router.get("/evidence/list/{user_id}")
async def get_evidence(user_id: str, current_user: Dict = Depends(get_current_user)):
    # Only professionals and education staff can view evidence
    if current_user["role"] not in [UserRole.PROFESSIONAL, UserRole.EDUCATION]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    evidence_list = await db.evidence.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("date", -1).to_list(100)
    
    return evidence_list


# EHCP Generation
@api_router.post("/ehcp/generate/{user_id}")
async def generate_ehcp(user_id: str, current_user: Dict = Depends(get_current_user)):
    # Only professionals can generate EHCPs
    if current_user["role"] != UserRole.PROFESSIONAL:
        raise HTTPException(status_code=403, detail="Only professionals can generate EHCPs")
    
    try:
        # Get user information
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get all evidence
        evidence_list = await db.evidence.find({"user_id": user_id}, {"_id": 0}).to_list(100)
        
        # Get questionnaire responses
        questionnaires = await db.questionnaires.find({"user_id": user_id}, {"_id": 0}).to_list(100)
        
        # AI-powered EHCP generation
        context = f"""
        Generate a comprehensive EHCP (Education, Health and Care Plan) for:
        Child: {user.get('full_name')}
        Evidence count: {len(evidence_list)}
        Questionnaire responses: {len(questionnaires)}
        
        Based on collected evidence and assessments, provide:
        1. Summary of needs
        2. Key recommendations
        3. Support strategies
        4. Educational provisions
        5. Health interventions
        """
        
        generated_content = await analyze_with_ai(context, context="ehcp_generation")
        
        # Extract recommendations from AI response
        recommendations = [
            "Multi-agency support coordination",
            "Regular monitoring and review cycles",
            "Parent/carer involvement in decision making",
            "Individualized learning support plan"
        ]
        
        # Create EHCP
        ehcp = EHCP(
            user_id=user_id,
            child_name=user.get('full_name', 'N/A'),
            generated_content=generated_content,
            evidence_summary=evidence_list[:10],
            assessment_summary={"total_questionnaires": len(questionnaires)},
            recommendations=recommendations
        )
        
        # Generate PDF
        pdf_data = {
            "child_name": ehcp.child_name,
            "evidence_summary": ehcp.evidence_summary,
            "recommendations": ehcp.recommendations
        }
        ehcp.pdf_base64 = generate_ehcp_pdf(pdf_data)
        
        # Store in database
        ehcp_dict = ehcp.model_dump()
        ehcp_dict['generated_at'] = ehcp_dict['generated_at'].isoformat()
        await db.ehcps.insert_one(ehcp_dict)
        
        return {
            "status": "success",
            "ehcp_id": ehcp.id,
            "content": generated_content,
            "pdf_base64": ehcp.pdf_base64
        }
    except Exception as e:
        logger.error(f"EHCP generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate EHCP: {str(e)}")


# Emotional Support (AI-powered)
@api_router.post("/support/emotional", response_model=EmotionalSupportResponse)
async def emotional_support(
    request: EmotionalSupportRequest,
    current_user: Dict = Depends(get_current_user)
):
    try:
        # AI-powered emotional support
        prompt = f"""
        A young person (ages 8-17) is seeking emotional support. Their message: "{request.message}"
        Current mood: {request.mood if request.mood else 'not specified'}
        
        Provide:
        1. Compassionate, age-appropriate response
        2. Assess crisis level (low/medium/high)
        3. Suggest appropriate resources
        4. If high crisis, emphasize immediate help (999, Samaritans 116 123)
        
        Respond in JSON format with: response, crisis_level, resources
        """
        
        ai_response = await analyze_with_ai(prompt, context="emotional_support")
        
        # Parse AI response (simplified for MVP)
        crisis_level = "low"
        if any(word in request.message.lower() for word in ["suicide", "harm", "kill", "die", "hurt"]):
            crisis_level = "high"
        elif any(word in request.message.lower() for word in ["sad", "depressed", "anxious", "worried"]):
            crisis_level = "medium"
        
        resources = [
            "Samaritans: 116 123",
            "Childline: 0800 1111",
            "NHS 111"
        ]
        
        if crisis_level == "high":
            resources.insert(0, "EMERGENCY: Call 999 or go to A&E immediately")
        
        return {
            "response": ai_response,
            "resources": resources,
            "crisis_level": crisis_level
        }
    except Exception as e:
        logger.error(f"Emotional support error: {e}")
        return {
            "response": "I'm here to help. If you're in crisis, please call 999 or Samaritans at 116 123.",
            "resources": ["Emergency: 999", "Samaritans: 116 123", "Childline: 0800 1111"],
            "crisis_level": "medium"
        }


# Pattern Recognition
@api_router.get("/analytics/patterns/{user_id}")
async def analyze_patterns(user_id: str, current_user: Dict = Depends(get_current_user)):
    # Only professionals can access analytics
    if current_user["role"] != UserRole.PROFESSIONAL:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    try:
        # Get all questionnaires for user
        questionnaires = await db.questionnaires.find({"user_id": user_id}, {"_id": 0}).to_list(100)
        
        if not questionnaires:
            return {"patterns": [], "insights": "No data available yet"}
        
        # AI pattern recognition
        data_summary = {
            "total_responses": len(questionnaires),
            "types": [q.get('questionnaire_type') for q in questionnaires],
            "recent_responses": questionnaires[:5]
        }
        
        prompt = f"""
        Analyze behavior patterns and trends from questionnaire data:
        {data_summary}
        
        Identify:
        1. Recurring themes
        2. Risk indicators (Red/Amber/Green)
        3. Positive progress markers
        4. Intervention recommendations
        """
        
        patterns = await analyze_with_ai(prompt, context="pattern_recognition")
        
        return {
            "patterns": patterns,
            "total_assessments": len(questionnaires),
            "risk_level": "amber"  # Would be determined by AI analysis
        }
    except Exception as e:
        logger.error(f"Pattern analysis error: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze patterns")


# Include router in main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
