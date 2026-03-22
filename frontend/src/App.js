import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Questionnaires from './pages/Questionnaires';
import SafeSpace from './pages/SafeSpace';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import EducationDashboard from './pages/EducationDashboard';
import { 
  PrivacyPolicy, 
  Terms, 
  Safeguarding, 
  Compliance, 
  Framework, 
  ClinicalSafety 
} from './pages/StaticPages';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/questionnaires" element={<Questionnaires />} />
              
              {/* User Portals */}
              <Route path="/safe-space" element={<SafeSpace />} />
              <Route path="/professional/login" element={<Login />} />
              <Route path="/professional/dashboard" element={<ProfessionalDashboard />} />
              <Route path="/education/login" element={<Login />} />
              <Route path="/education/dashboard" element={<EducationDashboard />} />
              
              {/* Static Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/safeguarding" element={<Safeguarding />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/framework" element={<Framework />} />
              <Route path="/clinical-safety" element={<ClinicalSafety />} />
              
              {/* Placeholder Routes */}
              <Route path="/testimonials" element={<div className="p-8 text-center">Testimonials - Coming Soon</div>} />
              <Route path="/learning-hub" element={<div className="p-8 text-center">Learning Hub - Coming Soon</div>} />
              <Route path="/courses" element={<div className="p-8 text-center">Courses - Coming Soon</div>} />
              <Route path="/ehcp-support" element={<div className="p-8 text-center">EHCP Support - Coming Soon</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
