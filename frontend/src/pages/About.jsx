import React from 'react';
import { Card, CardContent } from '../components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8" data-testid="about-heading">About NeuroPathway Safe Space</h1>
        
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-cyan-600 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              NeuroPathway Safe Space is an NHS-compliant digital platform designed to bridge the gap between Health Services, 
              Education, Parents, and Justice Services for neurodivergent children and young people aged 8-17.
            </p>
            <p className="text-gray-700 mb-4">
              We believe that <strong>Prevention Is the Cure</strong> and that small steps create big change in the lives 
              of neurodivergent children and their families.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-cyan-600 mb-4">What We Do</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>For Professionals:</strong> We provide digital early identification tools, risk scoring dashboards, 
                EHCP-ready summary generators, and multi-agency collaboration platforms.
              </p>
              <p>
                <strong>For Young People:</strong> We offer a safe space with private mood tracking, AI-powered emotional support, 
                crisis helplines, mindfulness exercises, and trusted adult connection features.
              </p>
              <p>
                <strong>For Families & Educators:</strong> We create a connected digital pathway that reduces wait times, 
                improves evidence gathering, and ensures consistent support across all services.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-cyan-600 mb-4">Created by Tania Hanson</h2>
            <p className="text-gray-700">
              NeuroPathway Safe Space was created to address the fragmented systems and long wait times that cause 
              neurodivergent children to deteriorate while waiting for support. Our platform is NHS-compliant, GDPR-compliant, 
              and designed with child safety at its core.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;