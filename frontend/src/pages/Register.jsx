import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { authAPI } from '../utils/api';
import { setToken, setUser } from '../utils/auth';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'youth',
    age: '',
    organization: '',
    consent_given: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.consent_given) {
      setError('You must agree to the terms and privacy policy');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null
      };
      
      const response = await authAPI.register(payload);
      const { access_token, user } = response.data;
      
      setToken(access_token);
      setUser(user);
      login(user, access_token);
      
      // Redirect based on role
      if (user.role === 'youth') {
        navigate('/safe-space');
      } else if (user.role === 'professional') {
        navigate('/professional/dashboard');
      } else if (user.role === 'education') {
        navigate('/education/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto" data-testid="register-form">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <img 
              src="https://neuropathwaysafespace.org/images/neuropathway-safe-space-logo.png" 
              alt="Safe Space Logo" 
              className="h-16 w-16"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Join Safe Space
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  data-testid="fullname-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  data-testid="email-input"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                data-testid="password-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">I am a...</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                required
                data-testid="role-select"
              >
                <option value="youth">Young Person (Ages 8-17)</option>
                <option value="professional">Healthcare Professional</option>
                <option value="education">Education Staff</option>
              </select>
            </div>
            
            {formData.role === 'youth' && (
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="8"
                  max="17"
                  value={formData.age}
                  onChange={handleChange}
                  data-testid="age-input"
                />
              </div>
            )}
            
            {(formData.role === 'professional' || formData.role === 'education') && (
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="NHS Trust, School, etc."
                  data-testid="organization-input"
                />
              </div>
            )}
            
            <div className="flex items-start space-x-2 bg-blue-50 p-4 rounded-lg">
              <input
                id="consent"
                name="consent_given"
                type="checkbox"
                checked={formData.consent_given}
                onChange={handleChange}
                className="mt-1"
                data-testid="consent-checkbox"
              />
              <Label htmlFor="consent" className="text-sm">
                I agree to the{' '}
                <Link to="/terms" className="text-cyan-600 hover:text-cyan-700">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy-policy" className="text-cyan-600 hover:text-cyan-700">Privacy Policy</Link>.
                I understand my data will be processed in accordance with GDPR and NHS data protection standards.
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              data-testid="register-submit-button"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;