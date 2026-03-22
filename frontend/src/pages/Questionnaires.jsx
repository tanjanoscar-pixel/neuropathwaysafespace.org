import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { questionnaireAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Questionnaires = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const questionnaireTypes = [
    {
      id: 'mood',
      title: 'Mood Check-In',
      description: 'Track your daily mood and feelings',
      icon: '😊',
      questions: [
        { id: 'mood', label: 'How are you feeling today?', type: 'scale', min: 1, max: 10 },
        { id: 'sleep', label: 'How well did you sleep last night?', type: 'scale', min: 1, max: 10 },
        { id: 'energy', label: 'How is your energy level?', type: 'scale', min: 1, max: 10 },
        { id: 'notes', label: 'Any additional notes?', type: 'text' }
      ]
    },
    {
      id: 'behavior',
      title: 'Behavior Assessment',
      description: 'Professional behavior observation tool',
      icon: '📋',
      professional: true,
      questions: [
        { id: 'attention', label: 'Attention and focus level', type: 'scale', min: 1, max: 10 },
        { id: 'social', label: 'Social interaction quality', type: 'scale', min: 1, max: 10 },
        { id: 'emotional', label: 'Emotional regulation', type: 'scale', min: 1, max: 10 },
        { id: 'observations', label: 'Detailed observations', type: 'textarea' }
      ]
    },
    {
      id: 'crisis',
      title: 'Crisis Check',
      description: 'Quick safety assessment',
      icon: '🚨',
      questions: [
        { id: 'safety', label: 'Do you feel safe right now?', type: 'yesno' },
        { id: 'harm', label: 'Are you thinking about harming yourself?', type: 'yesno' },
        { id: 'support', label: 'Do you have someone you can talk to?', type: 'yesno' },
        { id: 'details', label: 'Tell us more (optional)', type: 'textarea' }
      ]
    }
  ];

  const handleStartQuestionnaire = (type) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedType(type);
    setResponses({});
    setResult(null);
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await questionnaireAPI.submit({
        questionnaire_type: selectedType.id,
        responses: responses
      });
      setResult(response.data);
      setSelectedType(null);
      setResponses({});
    } catch (error) {
      alert('Failed to submit questionnaire');
    } finally {
      setLoading(false);
    }
  };

  if (selectedType) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card data-testid="questionnaire-form">
            <CardHeader>
              <CardTitle>{selectedType.title}</CardTitle>
              <CardDescription>{selectedType.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedType.questions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <label className="font-medium text-gray-900">{question.label}</label>
                  
                  {question.type === 'scale' && (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={question.min}
                        max={question.max}
                        value={responses[question.id] || question.min}
                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{question.min}</span>
                        <span className="font-semibold text-cyan-600">
                          {responses[question.id] || question.min}
                        </span>
                        <span>{question.max}</span>
                      </div>
                    </div>
                  )}
                  
                  {question.type === 'yesno' && (
                    <div className="flex space-x-4">
                      <Button
                        variant={responses[question.id] === 'yes' ? 'default' : 'outline'}
                        onClick={() => handleResponseChange(question.id, 'yes')}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={responses[question.id] === 'no' ? 'default' : 'outline'}
                        onClick={() => handleResponseChange(question.id, 'no')}
                      >
                        No
                      </Button>
                    </div>
                  )}
                  
                  {question.type === 'text' && (
                    <input
                      type="text"
                      value={responses[question.id] || ''}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                  
                  {question.type === 'textarea' && (
                    <textarea
                      value={responses[question.id] || ''}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={4}
                    />
                  )}
                </div>
              ))}
              
              <div className="flex space-x-3">
                <Button onClick={() => setSelectedType(null)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="flex-1" data-testid="submit-questionnaire">
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="questionnaires-heading">Questionnaires</h1>
          <p className="text-lg text-gray-600">
            Track wellbeing, behavior patterns, and identify support needs
          </p>
        </div>

        {result && (
          <Alert className="mb-8 bg-green-50 border-green-200">
            <AlertDescription>
              <p className="font-semibold mb-2">Questionnaire submitted successfully!</p>
              {result.analysis && (
                <p className="text-sm">{result.analysis.substring(0, 200)}...</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {questionnaireTypes.map((type) => (
            <Card key={type.id} className="hover:shadow-lg transition-shadow" data-testid={`questionnaire-card-${type.id}`}>
              <CardContent className="p-6">
                <div className="text-4xl mb-4 text-center">{type.icon}</div>
                <h3 className="text-xl font-semibold text-center mb-2">{type.title}</h3>
                <p className="text-gray-600 text-center text-sm mb-4">{type.description}</p>
                {type.professional && !user?.role.includes('professional') && !user?.role.includes('education') ? (
                  <p className="text-xs text-gray-500 text-center">Professional access required</p>
                ) : (
                  <Button 
                    onClick={() => handleStartQuestionnaire(type)} 
                    className="w-full"
                    data-testid={`start-${type.id}-button`}
                  >
                    Start
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questionnaires;