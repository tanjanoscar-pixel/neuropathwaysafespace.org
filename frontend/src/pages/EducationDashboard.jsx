import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';

const EducationDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="education-dashboard-heading">
            Education Dashboard
          </h1>
          <p className="text-gray-600">Welcome, {user?.full_name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-cyan-50 border-cyan-200">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-cyan-600">47</p>
              <p className="text-gray-600">Students Enrolled</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-orange-600">8</p>
              <p className="text-gray-600">Assessments Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-green-600">93%</p>
              <p className="text-gray-600">Engagement Rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View and manage student assessments and questionnaires.</p>
              <Button className="w-full" onClick={() => window.location.href = '/questionnaires'}>
                View Assessments
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Access training resources and best practices.</p>
              <Button variant="outline" className="w-full">
                Access Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EducationDashboard;