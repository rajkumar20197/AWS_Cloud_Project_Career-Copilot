/**
 * Demo Activator Component
 * Shows the complete "Wake up → Check Calendar → See Everything" workflow
 */

import React, { useState } from 'react';
import { Play, CheckCircle, Clock, Mail, Calendar, Bot } from 'lucide-react';

const DemoActivator = () => {
  const [demoStep, setDemoStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const demoSteps = [
    {
      title: "📧 Interview Email Arrives",
      description: "Google recruiter sends interview invitation at 2:00 AM",
      icon: <Mail className="h-6 w-6" />,
      duration: 1000
    },
    {
      title: "🤖 AI Agent Detects Email",
      description: "Email Classification Agent identifies interview request",
      icon: <Bot className="h-6 w-6" />,
      duration: 2000
    },
    {
      title: "📅 Calendar Check",
      description: "Availability Agent checks your calendar for open slots",
      icon: <Calendar className="h-6 w-6" />,
      duration: 1500
    },
    {
      title: "✍️ Response Generated",
      description: "AI writes professional response with 3 time slot options",
      icon: <CheckCircle className="h-6 w-6" />,
      duration: 2000
    },
    {
      title: "📤 Email Sent",
      description: "Professional response sent to Google recruiter",
      icon: <Mail className="h-6 w-6" />,
      duration: 1000
    },
    {
      title: "📅 Calendar Updated",
      description: "Interview and prep time added to your calendar",
      icon: <Calendar className="h-6 w-6" />,
      duration: 1000
    },
    {
      title: "🎯 Prep Started",
      description: "Interview Prep Agent begins Google company research",
      icon: <Bot className="h-6 w-6" />,
      duration: 1500
    },
    {
      title: "📱 Student Notified",
      description: "You wake up to: 'Interview response sent to Google!'",
      icon: <CheckCircle className="h-6 w-6" />,
      duration: 1000
    }
  ];

  const runDemo = async () => {
    setIsRunning(true);
    setDemoStep(0);

    for (let i = 0; i < demoSteps.length; i++) {
      setDemoStep(i);
      await new Promise(resolve => setTimeout(resolve, demoSteps[i].duration));
    }

    setDemoStep(demoSteps.length);
    setIsRunning(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎯 AI Career Agent Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Watch how your AI agents work together to automate your entire job search workflow
          </p>
          
          {!isRunning && demoStep === 0 && (
            <button
              onClick={runDemo}
              className="flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto text-lg font-semibold"
            >
              <Play className="h-6 w-6 mr-3" />
              Start Demo Workflow
            </button>
          )}
        </div>

        {/* Demo Steps */}
        <div className="space-y-4">
          {demoSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center p-4 rounded-lg transition-all duration-500 ${
                index < demoStep
                  ? 'bg-green-50 border-l-4 border-green-500'
                  : index === demoStep
                  ? 'bg-blue-50 border-l-4 border-blue-500 animate-pulse'
                  : 'bg-gray-50 border-l-4 border-gray-300'
              }`}
            >
              <div className={`p-3 rounded-full mr-4 ${
                index < demoStep
                  ? 'bg-green-100 text-green-600'
                  : index === demoStep
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {index < demoStep ? <CheckCircle className="h-6 w-6" /> : step.icon}
              </div>
              
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  index <= demoStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${
                  index <= demoStep ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
              </div>

              {index === demoStep && isRunning && (
                <div className="flex items-center text-blue-600">
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              )}

              {index < demoStep && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Demo Complete */}
        {demoStep >= demoSteps.length && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg text-white text-center">
            <h2 className="text-2xl font-bold mb-2">🎉 Demo Complete!</h2>
            <p className="text-lg mb-4">
              Total time: 3 minutes - completely automated!
            </p>
            <p className="text-sm opacity-90">
              This is what happens every time you receive an interview invitation - 
              your AI agents handle everything while you sleep!
            </p>
            
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => {setDemoStep(0); setIsRunning(false);}}
                className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Run Demo Again
              </button>
              
              <button
                onClick={() => window.location.href = '#/morning-dashboard'}
                className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                View Morning Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Key Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Save 10+ Hours/Week</h3>
            <p className="text-sm text-gray-600">
              Eliminate manual job search administration
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Never Miss Opportunities</h3>
            <p className="text-sm text-gray-600">
              24/7 monitoring and instant professional responses
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bot className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Always Professional</h3>
            <p className="text-sm text-gray-600">
              AI maintains perfect communication standards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoActivator;