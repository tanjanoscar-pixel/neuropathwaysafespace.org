import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { logout as logoutUtil } from '../utils/auth';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    logoutUtil();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://neuropathwaysafespace.org/images/neuropathway-safe-space-logo.png" 
              alt="Safe Space Logo" 
              className="h-10 w-10"
            />
            <span className="font-bold text-lg text-[#0a1628]">Safe Space</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!user && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/safe-space')}
                  className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                  data-testid="youth-nav-button"
                >
                  Youth
                </Button>
                <Link to="/" className="text-gray-700 hover:text-cyan-600">Home</Link>
                <Link to="/about" className="text-gray-700 hover:text-cyan-600">About</Link>
                <Link to="/questionnaires" className="text-gray-700 hover:text-cyan-600">Questionnaires</Link>
                <Link to="/contact" className="text-gray-700 hover:text-cyan-600">Contact</Link>
              </>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.full_name}</span>
                <Button onClick={() => navigate(`/${user.role}/dashboard`)} variant="outline" size="sm" data-testid="dashboard-button">
                  Dashboard
                </Button>
                <Button onClick={handleLogout} variant="ghost" size="sm" data-testid="logout-button">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button onClick={() => navigate('/login')} variant="outline" size="sm" data-testid="login-button">
                  Login
                </Button>
                <Button onClick={() => navigate('/register')} variant="default" size="sm" data-testid="register-button">
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white" data-testid="mobile-menu">
          <div className="px-4 py-2 space-y-2">
            <Link to="/" className="block py-2 text-gray-700">Home</Link>
            <Link to="/about" className="block py-2 text-gray-700">About</Link>
            <Link to="/questionnaires" className="block py-2 text-gray-700">Questionnaires</Link>
            <Link to="/contact" className="block py-2 text-gray-700">Contact</Link>
            {!user && (
              <>
                <Link to="/login" className="block py-2 text-gray-700">Login</Link>
                <Link to="/register" className="block py-2 text-gray-700">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
