import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from '../components/ui/button';

interface FAQProps {
  onBack?: () => void;
}

export default function FAQ({ onBack }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click the "Sign Up" button in the top right corner, enter your email and password, and verify your email address. It takes less than 2 minutes!',
        },
        {
          q: 'Is Career Copilot free?',
          a: 'Yes! We offer a free plan with 10 AI requests per month. You can upgrade to Pro ($9.99/month) or Premium ($19.99/month) for unlimited access and additional features.',
        },
        {
          q: 'What makes Career Copilot different?',
          a: 'We use advanced AI (AWS Bedrock) to provide personalized career guidance, resume optimization, interview prep, and job matching - all in one platform at an affordable price.',
        },
      ],
    },
    {
      category: 'Features',
      questions: [
        {
          q: 'How does the AI resume builder work?',
          a: 'Our AI analyzes your experience, skills, and target job to generate a professional, ATS-optimized resume. You can customize it with different templates and export as PDF.',
        },
        {
          q: 'Can I track my job applications?',
          a: 'Yes! Our application tracker helps you organize all your applications, set reminders for follow-ups, and track your progress through the interview process.',
        },
        {
          q: 'How accurate is the job matching?',
          a: 'Our AI considers your skills, experience, preferences, and career goals to match you with relevant opportunities. The more you use it, the better it gets!',
        },
        {
          q: 'Can I schedule interview prep sessions?',
          a: 'Absolutely! Connect your Google Calendar and schedule AI-powered interview prep sessions. We\'ll send reminders and provide personalized preparation materials.',
        },
      ],
    },
    {
      category: 'Billing & Payments',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, Apple Pay, Google Pay, and Klarna (buy now, pay later).',
        },
        {
          q: 'Can I cancel anytime?',
          a: 'Yes! You can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your billing period.',
        },
        {
          q: 'Do you offer refunds?',
          a: 'Yes, we offer a 7-day money-back guarantee. If you\'re not satisfied, contact support@careercopilot.com within 7 days of purchase for a full refund.',
        },
        {
          q: 'Can I upgrade or downgrade my plan?',
          a: 'Yes! You can change your plan at any time from Settings > Billing. Changes take effect immediately, and we\'ll prorate the difference.',
        },
      ],
    },
    {
      category: 'Privacy & Security',
      questions: [
        {
          q: 'Is my data secure?',
          a: 'Absolutely! We use bank-level encryption (SSL/TLS), secure password hashing, and follow industry best practices. Your data is stored securely on AWS.',
        },
        {
          q: 'Do you sell my data?',
          a: 'Never! We do not sell, rent, or share your personal information with third parties for marketing purposes. Your privacy is our priority.',
        },
        {
          q: 'Can I delete my account?',
          a: 'Yes, you can delete your account anytime from Settings > Account. All your data will be permanently deleted within 30 days.',
        },
        {
          q: 'Are you GDPR compliant?',
          a: 'Yes! We comply with GDPR, CCPA, and other privacy regulations. You have full control over your data and can request access, correction, or deletion anytime.',
        },
      ],
    },
    {
      category: 'Technical',
      questions: [
        {
          q: 'What browsers do you support?',
          a: 'Career Copilot works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.',
        },
        {
          q: 'Is there a mobile app?',
          a: 'Not yet, but our website is fully mobile-responsive and works great on phones and tablets. A native mobile app is planned for 2025!',
        },
        {
          q: 'Can I export my data?',
          a: 'Yes! You can export your resumes as PDF, and download your profile data as JSON from Settings > Data Export.',
        },
        {
          q: 'Do you have an API?',
          a: 'Not currently, but we\'re planning to release a public API in 2025. Join our waitlist to be notified when it\'s available!',
        },
      ],
    },
  ];

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to common questions about Career Copilot
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        {filteredFaqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((faq, faqIndex) => {
                const globalIndex = categoryIndex * 100 + faqIndex;
                const isOpen = openIndex === globalIndex;

                return (
                  <div
                    key={faqIndex}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 text-gray-700">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* No Results */}
        {searchQuery && filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No results found for "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="mb-6">
            Can't find the answer you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/support"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Contact Support
            </a>
            <a
              href="mailto:support@careercopilot.com"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all border-2 border-white"
            >
              Email Us
            </a>
          </div>
        </div>

        {/* Back Button */}
        {onBack && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={onBack}>
              ← Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
