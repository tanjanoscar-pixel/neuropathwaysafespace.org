import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="https://neuropathwaysafespace.org/images/neuropathway-safe-space-logo.png" 
                alt="NeuroPathway" 
                className="h-8 w-8"
              />
              <span className="font-bold text-lg text-[#0a1628]">NeuroPathway</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Prevention Is the Cure. Connecting families, schools, and healthcare for neurodivergent support.
            </p>
            <p className="text-xs text-gray-500">Created by Tania Hanson</p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-600 hover:text-cyan-600">About Us</Link></li>
              <li><Link to="/framework" className="text-gray-600 hover:text-cyan-600">Framework Listing</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-cyan-600">Contact</Link></li>
              <li><Link to="/testimonials" className="text-gray-600 hover:text-cyan-600">Testimonials</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/learning-hub" className="text-gray-600 hover:text-cyan-600">Learning Hub</Link></li>
              <li><Link to="/courses" className="text-gray-600 hover:text-cyan-600">Courses</Link></li>
              <li><Link to="/ehcp-support" className="text-gray-600 hover:text-cyan-600">EHCP Support</Link></li>
              <li><Link to="/questionnaires" className="text-gray-600 hover:text-cyan-600">Questionnaires</Link></li>
            </ul>
          </div>

          {/* Legal & Safety Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal & Safety</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="text-gray-600 hover:text-cyan-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-cyan-600">Terms of Service</Link></li>
              <li><Link to="/safeguarding" className="text-gray-600 hover:text-cyan-600">Safeguarding</Link></li>
              <li><Link to="/compliance" className="text-gray-600 hover:text-cyan-600">Compliance</Link></li>
            </ul>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>NHS Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>DCB0129 Framework</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>Child Safe Design</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} NeuroPathway Eco-System. All rights reserved.</p>
          <p className="mt-2">
            <a href="mailto:hello@neuropathwaysafespace.org" className="text-cyan-600 hover:text-cyan-700">
              hello@neuropathwaysafespace.org
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
