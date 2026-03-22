import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#0a1628] rounded-2xl p-8 shadow-xl">
              <img 
                src="https://neuropathwaysafespace.org/images/neuropathway-safe-space-logo.png" 
                alt="Safe Space Logo" 
                className="h-40 w-40 mx-auto"
              />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            NHS-compliant platform bridging Health Services,<br />
            Education, Parents and Justice Services
          </h1>
          
          <p className="text-xl text-orange-500 font-semibold mb-8">
            Prevention Is the Cure - Small Steps Create Big Change
          </p>
        </div>

        {/* Crisis Alert */}
        <Alert variant="destructive" className="max-w-4xl mx-auto mb-12" data-testid="crisis-alert">
          <AlertDescription>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold mb-1">If you are in crisis or feel unsafe:</p>
                <p>
                  Call <strong>999</strong> or go to <strong>A&E</strong> immediately. 
                  You can also contact <strong>Samaritans (116 123)</strong> or <strong>NHS 111</strong> for urgent mental health support.
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </section>

      {/* The Challenge Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-cyan-600 mb-4 text-center" data-testid="challenge-heading">
                The Challenge
              </h2>
              
              <p className="text-lg text-gray-700 mb-8 text-center">
                Children deteriorate while services work in silos. Families repeat their story. Professionals lack one shared view.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Delayed identification of neurodivergent needs',
                  'Fragmented systems with no connected digital pathway',
                  'Long wait times leading to crisis escalation',
                  'Inconsistent evidence gathering',
                  'High demand on CAMHS, schools, and A&E',
                  'Inequalities in access for high-need families'
                ].map((challenge, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <p className="text-gray-800">{challenge}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Solution Section */}
      <section className="py-16 bg-gradient-to-b from-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cyan-600 mb-2" data-testid="solution-heading">Our Solution</h2>
            <p className="text-xl text-orange-500 font-semibold">The Safe Space Eco-System</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Professional Tools */}
            <Card className="bg-[#0a1628] text-white border-none shadow-xl" data-testid="professional-tools-card">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-cyan-500 p-3 rounded-lg">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-cyan-400">Professional Tools</h3>
                    <p className="text-gray-300 text-sm">For NHS, Schools & Multi-Agency Teams</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    'Digital early identification questionnaires',
                    'Risk scoring dashboard with Red/Amber/Green alerts',
                    'EHCP-ready summary generator (saves 10-15 hours per case)',
                    'QB Test integration for ADHD assessment',
                    'Multi-agency evidence sharing',
                    'Case management & collaboration tools'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-[#0a1628]"
                    onClick={() => navigate('/professional/login')}
                    data-testid="professional-login-button"
                  >
                    Professional Login
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-[#0a1628]"
                    onClick={() => navigate('/education/login')}
                    data-testid="education-login-button"
                  >
                    Education Login
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Your Safe Space */}
            <Card className="bg-gradient-to-br from-teal-800 to-teal-900 text-white border-none shadow-xl" data-testid="safe-space-card">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-pink-500 p-3 rounded-lg">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Your Safe Space</h3>
                      <p className="text-gray-200 text-sm">For Young People Ages 8-17</p>
                    </div>
                  </div>
                  <div className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    FREE for Students
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    'Private mood tracking & journaling',
                    'AI-powered emotional support',
                    'Crisis helplines & safety planning',
                    'Mindfulness exercises & coping tools',
                    'Trusted adult connection features',
                    'Fun, engaging interface designed for young people'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-100">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-gray-200 mb-4">
                  FREE for all children whose school holds a NeuroPathway licence
                </p>

                <Button 
                  variant="gradient"
                  className="w-full"
                  onClick={() => navigate('/safe-space')}
                  data-testid="enter-safe-space-button"
                >
                  Enter Your Safe Space
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Impact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12" data-testid="impact-heading">
            Platform Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center border-2 border-cyan-200 bg-cyan-50">
              <CardContent className="p-6">
                <svg className="w-12 h-12 text-cyan-600 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <p className="text-4xl font-bold text-cyan-600">40%</p>
                <p className="text-gray-600 mt-1">Reduced wait times</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <svg className="w-12 h-12 text-orange-600 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <p className="text-4xl font-bold text-orange-600">10-15hrs</p>
                <p className="text-gray-600 mt-1">Saved per EHCP</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-cyan-200 bg-cyan-50">
              <CardContent className="p-6">
                <svg className="w-12 h-12 text-cyan-600 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-4xl font-bold text-cyan-600">NHS</p>
                <p className="text-gray-600 mt-1">Compliant & Secure</p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <svg className="w-12 h-12 text-orange-600 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
                <p className="text-4xl font-bold text-orange-600">Multi</p>
                <p className="text-gray-600 mt-1">Agency Connected</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <Button variant="outline" onClick={() => navigate('/framework')} data-testid="framework-button">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
              </svg>
              Framework Listing
            </Button>
            <Button variant="outline" onClick={() => navigate('/clinical-safety')} data-testid="clinical-safety-button">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Clinical Safety
            </Button>
            <Button variant="outline" onClick={() => navigate('/questionnaires')} data-testid="questionnaires-button">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
              </svg>
              Questionnaires
            </Button>
            <Button variant="outline" onClick={() => navigate('/about')} data-testid="about-button">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              About Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
