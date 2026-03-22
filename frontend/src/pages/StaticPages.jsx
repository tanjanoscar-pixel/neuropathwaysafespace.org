import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const SimplePage = ({ title, content }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">{title}</h1>
        <Card>
          <CardContent className="p-8">
            <div className="prose max-w-none">{content}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const PrivacyPolicy = () => (
  <SimplePage 
    title="Privacy Policy"
    content={
      <div>
        <h2 className="text-2xl font-semibold mb-4">GDPR Compliance</h2>
        <p className="mb-4">
          Safe Space is committed to protecting your privacy and ensuring GDPR compliance. 
          We collect and process personal data only with your explicit consent and in accordance with 
          UK data protection laws.
        </p>
        <h3 className="text-xl font-semibold mb-2">Data We Collect</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Personal information (name, email, age)</li>
          <li>Questionnaire responses and assessments</li>
          <li>Mood tracking and journal entries</li>
          <li>AI chat interactions for support purposes</li>
        </ul>
        <h3 className="text-xl font-semibold mb-2">Your Rights</h3>
        <p className="mb-4">
          You have the right to access, rectify, erase, or restrict processing of your data. 
          Contact us at hello@neuropathwaysafespace.org to exercise your rights.
        </p>
      </div>
    }
  />
);

export const Terms = () => (
  <SimplePage 
    title="Terms of Service"
    content={
      <div>
        <p className="mb-4">
          By using Safe Space, you agree to these terms of service.
        </p>
        <h3 className="text-xl font-semibold mb-2">Acceptable Use</h3>
        <p className="mb-4">
          This platform is designed for neurodivergent support and must be used responsibly. 
          Users must not misuse the platform or attempt to access unauthorized data.
        </p>
        <h3 className="text-xl font-semibold mb-2">Professional Use</h3>
        <p className="mb-4">
          Healthcare professionals and educators must comply with their professional standards 
          and use the platform in accordance with NHS and educational guidelines.
        </p>
      </div>
    }
  />
);

export const Safeguarding = () => (
  <SimplePage 
    title="Safeguarding Policy"
    content={
      <div>
        <p className="mb-4">
          Child safety is our highest priority. Safe Space follows strict safeguarding protocols.
        </p>
        <h3 className="text-xl font-semibold mb-2">Child Protection</h3>
        <p className="mb-4">
          All content is monitored for child safety. AI interactions are designed to identify crisis situations 
          and provide immediate support resources.
        </p>
        <h3 className="text-xl font-semibold mb-2">Reporting Concerns</h3>
        <p className="mb-4">
          If you have concerns about a child's safety, contact emergency services (999) immediately. 
          You can also report concerns to our safeguarding team at hello@neuropathwaysafespace.org.
        </p>
      </div>
    }
  />
);

export const Compliance = () => (
  <SimplePage 
    title="Compliance & Approvals"
    content={
      <div>
        <h3 className="text-xl font-semibold mb-2">NHS Compliance</h3>
        <p className="mb-4">
          Safe Space meets NHS digital standards and clinical safety requirements.
        </p>
        <h3 className="text-xl font-semibold mb-2">DCB0129 Framework</h3>
        <p className="mb-4">
          Our platform complies with DCB0129 clinical risk management standards.
        </p>
        <h3 className="text-xl font-semibold mb-2">GDPR Compliant</h3>
        <p className="mb-4">
          Full compliance with UK GDPR and data protection regulations.
        </p>
      </div>
    }
  />
);

export const Framework = () => (
  <SimplePage 
    title="Framework Listing"
    content={
      <div>
        <p className="mb-4">
          Safe Space is built on established healthcare and educational frameworks.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>NHS Digital Technology Assessment Criteria (DTAC)</li>
          <li>DCB0129 Clinical Risk Management</li>
          <li>SEND Code of Practice</li>
          <li>NICE Guidelines for ADHD and Autism</li>
        </ul>
      </div>
    }
  />
);

export const ClinicalSafety = () => (
  <SimplePage 
    title="Clinical Safety"
    content={
      <div>
        <p className="mb-4">
          Our platform meets rigorous clinical safety standards to ensure user wellbeing.
        </p>
        <h3 className="text-xl font-semibold mb-2">Risk Management</h3>
        <p className="mb-4">
          All features undergo clinical risk assessment and continuous monitoring.
        </p>
        <h3 className="text-xl font-semibold mb-2">Crisis Detection</h3>
        <p className="mb-4">
          AI-powered crisis detection provides immediate support resources and escalation protocols.
        </p>
      </div>
    }
  />
);

export default SimplePage;