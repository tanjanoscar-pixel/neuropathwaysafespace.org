import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ehcpAPI, evidenceAPI, analyticsAPI, questionnaireAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProfessionalDashboard = () => {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [evidence, setEvidence] = useState([]);
  const [patterns, setPatterns] = useState(null);
  const [ehcpResult, setEhcpResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateEHCP = async () => {
    if (!selectedUserId) {
      alert('Please enter a user ID');
      return;
    }

    setLoading(true);
    try {
      const response = await ehcpAPI.generate(selectedUserId);
      setEhcpResult(response.data);
      alert('EHCP generated successfully!');
    } catch (error) {
      alert('Failed to generate EHCP: ' + (error.response?.data?.detail || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatterns = async () => {
    if (!selectedUserId) {
      alert('Please enter a user ID');
      return;
    }

    try {
      const response = await analyticsAPI.patterns(selectedUserId);
      setPatterns(response.data);
    } catch (error) {
      alert('Failed to load patterns');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="professional-dashboard-heading">
            Professional Dashboard
          </h1>
          <p className="text-gray-600">Welcome, {user?.full_name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-cyan-50 border-cyan-200">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-cyan-600">24</p>
              <p className="text-gray-600">Active Cases</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-orange-600">5</p>
              <p className="text-gray-600">Pending EHCPs</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-green-600">12</p>
              <p className="text-gray-600">Completed This Month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card data-testid="ehcp-generator-card">
            <CardHeader className="bg-[#0a1628] text-white rounded-t-xl">
              <CardTitle>EHCP Auto-Generator</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Child/Young Person User ID</label>
                <input
                  type="text"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  placeholder="Enter user ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  data-testid="user-id-input"
                />
              </div>
              <Button 
                onClick={handleGenerateEHCP} 
                disabled={loading} 
                className="w-full"
                data-testid="generate-ehcp-button"
              >
                {loading ? 'Generating EHCP...' : 'Generate EHCP'}
              </Button>
              {ehcpResult && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="font-semibold text-green-900 mb-2">EHCP Generated Successfully!</p>
                  <p className="text-sm text-gray-700 mb-2">ID: {ehcpResult.ehcp_id}</p>
                  {ehcpResult.pdf_base64 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `data:application/pdf;base64,${ehcpResult.pdf_base64}`;
                        link.download = `EHCP_${ehcpResult.ehcp_id}.pdf`;
                        link.click();
                      }}
                    >
                      Download PDF
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card data-testid="pattern-recognition-card">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-t-xl">
              <CardTitle>AI Pattern Recognition</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Analyze Patterns For</label>
                <input
                  type="text"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  placeholder="Enter user ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <Button onClick={handleViewPatterns} className="w-full" data-testid="view-patterns-button">
                Analyze Patterns
              </Button>
              {patterns && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 max-h-96 overflow-y-auto">
                  <p className="font-semibold mb-2">Analysis Results:</p>
                  
                  {/* Data Summary */}
                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    <div className="bg-white p-2 rounded">
                      <p className="text-xs text-gray-600">Assessments</p>
                      <p className="text-lg font-bold text-cyan-600">{patterns.total_assessments || 0}</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <p className="text-xs text-gray-600">Chat Messages</p>
                      <p className="text-lg font-bold text-teal-600">{patterns.chat_interactions || 0}</p>
                    </div>
                    <div className="bg-white p-2 rounded">
                      <p className="text-xs text-gray-600">Evidence</p>
                      <p className="text-lg font-bold text-orange-600">{patterns.evidence_count || 0}</p>
                    </div>
                  </div>

                  {/* Risk Level Badge */}
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      patterns.risk_level === 'red' ? 'bg-red-200 text-red-800' :
                      patterns.risk_level === 'amber' ? 'bg-orange-200 text-orange-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      Risk Level: {patterns.risk_level?.toUpperCase()}
                    </span>
                  </div>

                  {/* Insights */}
                  {patterns.insights && patterns.insights.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold mb-1">Key Insights:</p>
                      <ul className="text-xs space-y-1">
                        {patterns.insights.map((insight, i) => (
                          <li key={i} className="bg-white p-2 rounded">{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Mood Distribution */}
                  {patterns.mood_distribution && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold mb-1">Mood Distribution:</p>
                      <div className="grid grid-cols-5 gap-1 text-xs text-center">
                        <div className="bg-yellow-100 p-1 rounded">
                          <p className="font-semibold">{patterns.mood_distribution.happy || 0}</p>
                          <p>Happy</p>
                        </div>
                        <div className="bg-blue-100 p-1 rounded">
                          <p className="font-semibold">{patterns.mood_distribution.sad || 0}</p>
                          <p>Sad</p>
                        </div>
                        <div className="bg-purple-100 p-1 rounded">
                          <p className="font-semibold">{patterns.mood_distribution.anxious || 0}</p>
                          <p>Anxious</p>
                        </div>
                        <div className="bg-red-100 p-1 rounded">
                          <p className="font-semibold">{patterns.mood_distribution.angry || 0}</p>
                          <p>Angry</p>
                        </div>
                        <div className="bg-gray-100 p-1 rounded">
                          <p className="font-semibold">{patterns.mood_distribution.confused || 0}</p>
                          <p>Confused</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Analysis */}
                  <p className="text-sm text-gray-700">{patterns.patterns?.substring(0, 300)}...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" onClick={() => window.location.href = '/questionnaires'}>
                View Questionnaires
              </Button>
              <Button variant="outline">
                Case Management
              </Button>
              <Button variant="outline">
                Multi-Agency Sharing
              </Button>
              <Button variant="outline">
                Reports & Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
