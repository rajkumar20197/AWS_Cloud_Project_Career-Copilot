import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, Send, HelpCircle, Book, Video } from 'lucide-react';

export default function SupportPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await fetch('/api/support/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ message }),
      });

      setMessage('');
      // Add message to chat
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      await fetch('/api/support/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          type: formData.get('type'),
          message: formData.get('message'),
          rating: formData.get('rating'),
        }),
      });

      setFeedbackSubmitted(true);
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How Can We Help?</h1>
          <p className="text-xl text-gray-600">
            We're here to support your career journey every step of the way.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Live Chat */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">
              Get instant answers from our AI assistant or connect with our team.
            </p>
            <button
              onClick={() => setChatOpen(true)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all"
            >
              Start Chat
            </button>
            <p className="text-sm text-gray-500 mt-2">Usually responds in &lt; 1 minute</p>
          </div>

          {/* Email Support */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">
              Send us a detailed message and we'll respond within 24 hours.
            </p>
            <a
              href="mailto:support@careercopilot.com"
              className="block w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-all text-center"
            >
              Send Email
            </a>
            <p className="text-sm text-gray-500 mt-2">support@careercopilot.com</p>
          </div>

          {/* Phone Support */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">
              Talk to a real person. Available Mon-Fri, 9 AM - 5 PM EST.
            </p>
            <a
              href="tel:+1-555-CAREER"
              className="block w-full bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600 transition-all text-center"
            >
              Call Us
            </a>
            <p className="text-sm text-gray-500 mt-2">+1 (555) CAREER-1</p>
          </div>
        </div>

        {/* Self-Service Resources */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Self-Service Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/help"
              className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-all"
            >
              <Book className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Help Center</h3>
                <p className="text-sm text-gray-600">Browse articles and guides</p>
              </div>
            </a>
            <a
              href="/faq"
              className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-all"
            >
              <HelpCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">FAQ</h3>
                <p className="text-sm text-gray-600">Common questions answered</p>
              </div>
            </a>
            <a
              href="/tutorials"
              className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-all"
            >
              <Video className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Video Tutorials</h3>
                <p className="text-sm text-gray-600">Learn with step-by-step videos</p>
              </div>
            </a>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Send Us Feedback</h2>
          {feedbackSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-800 font-semibold">Thank you for your feedback!</p>
              <p className="text-green-600 text-sm mt-2">
                We appreciate you taking the time to help us improve.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback Type
                </label>
                <select
                  name="type"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select type...</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="improvement">Improvement Suggestion</option>
                  <option value="compliment">Compliment</option>
                  <option value="complaint">Complaint</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How would you rate your experience?
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        className="sr-only peer"
                        required
                      />
                      <div className="w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-blue-300 transition-all">
                        <span className="text-lg font-semibold">{rating}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">1 = Poor, 5 = Excellent</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback
                </label>
                <textarea
                  name="message"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us what you think..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Chat Widget */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              <div>
                <h3 className="font-semibold">Career Copilot Support</h3>
                <p className="text-xs opacity-90">We typically reply in minutes</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white hover:bg-white/20 rounded p-1"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="bg-white rounded-lg p-3 mb-3 shadow-sm">
              <p className="text-sm text-gray-800">
                Hi! 👋 I'm your AI assistant. How can I help you today?
              </p>
              <p className="text-xs text-gray-500 mt-1">Just now</p>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
