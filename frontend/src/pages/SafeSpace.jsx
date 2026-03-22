import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { supportAPI, questionnaireAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const SafeSpace = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    const userMessage = message;
    setMessage('');
    
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await supportAPI.emotional({
        message: userMessage,
        mood: mood
      });

      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response,
        resources: response.data.resources,
        crisis_level: response.data.crisis_level
      }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'I am here to help. If you are in crisis, please call 999 or Samaritans at 116 123.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-cyan-100 to-pink-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-800 mb-2" data-testid="safe-space-heading">Your Safe Space</h1>
          <p className="text-lg text-gray-700">A safe place for you to express yourself</p>
          {user && <p className="text-sm text-gray-600 mt-2">Welcome, {user.full_name}!</p>}
        </div>

        {/* Crisis Alert */}
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardContent className="p-4">
            <p className="text-sm text-red-800">
              <strong>Need help now?</strong> Call 999 (Emergency) | Childline: 0800 1111 | Samaritans: 116 123
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Emotional Support Chat */}
          <Card className="lg:col-span-2" data-testid="emotional-support-chat">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-t-xl">
              <CardTitle>Talk to Your AI Friend</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="bg-white rounded-lg p-4 h-96 overflow-y-auto mb-4 border border-gray-200">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <p className="text-lg mb-2">Hi there!</p>
                    <p>I am here to listen and support you. How are you feeling today?</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((msg, index) => (
                      <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-cyan-500 text-white' 
                            : 'bg-gray-200 text-gray-900'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          {msg.resources && (
                            <div className="mt-2 text-xs border-t pt-2">
                              <p className="font-semibold">Resources:</p>
                              {msg.resources.map((resource, i) => (
                                <p key={i}>{resource}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex space-x-2">
                  {['Happy', 'Sad', 'Anxious', 'Angry', 'Confused'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(m)}
                      className={`px-3 py-1 rounded-full text-xs ${
                        mood === m ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    data-testid="message-input"
                  />
                  <Button onClick={handleSendMessage} disabled={loading} data-testid="send-message-button">
                    {loading ? '...' : 'Send'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tools */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-pink-100 to-purple-100">
              <CardHeader>
                <CardTitle className="text-lg">Mood Journal</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="gradient" onClick={() => window.location.href = '/questionnaires'} data-testid="mood-journal-button">
                  Track Your Mood
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-100 to-teal-100">
              <CardHeader>
                <CardTitle className="text-lg">Calm Corner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">Take a moment to breathe and relax</p>
                <Button className="w-full" variant="outline" data-testid="breathing-exercise-button">
                  Breathing Exercise
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-100 to-orange-100">
              <CardHeader>
                <CardTitle className="text-lg">Positive Vibes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 italic">
                  You are braver than you believe, stronger than you seem, and smarter than you think.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeSpace;
