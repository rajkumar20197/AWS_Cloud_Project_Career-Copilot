import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last Updated: December 19, 2024</p>

        <div className="prose prose-blue max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Career Copilot ("Service"), you accept and agree to be bound by
              the terms and provision of this agreement. If you do not agree to these Terms of
              Service, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Career Copilot is an AI-powered career assistance platform that provides:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Resume building and optimization</li>
              <li>Job search and matching</li>
              <li>Interview preparation</li>
              <li>Cover letter generation</li>
              <li>Career guidance and advice</li>
              <li>Application tracking</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              To use certain features of the Service, you must register for an account. You agree
              to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscription Plans</h2>
            <p className="text-gray-700 mb-4">
              Career Copilot offers both free and paid subscription plans:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>
                <strong>Free Plan:</strong> Limited to 10 AI requests per month
              </li>
              <li>
                <strong>Pro Plan ($9.99/month):</strong> Unlimited AI requests and premium features
              </li>
              <li>
                <strong>Premium Plan ($19.99/month):</strong> All Pro features plus expert coaching
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              For paid subscriptions:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Payments are processed securely through Stripe</li>
              <li>Subscriptions automatically renew unless canceled</li>
              <li>You can cancel anytime from your account settings</li>
              <li>Refunds are provided within 7 days of purchase</li>
              <li>No refunds for partial months</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Acceptable Use</h2>
            <p className="text-gray-700 mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Use the Service for any illegal purpose</li>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit viruses or malicious code</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Interfere with the Service's operation</li>
              <li>Scrape or harvest data without permission</li>
              <li>Share your account with others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content, features, and functionality of Career Copilot are owned by us and
              protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 mb-4">
              You retain ownership of content you create using our Service (resumes, cover letters,
              etc.), but grant us a license to use it to provide and improve the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. AI-Generated Content</h2>
            <p className="text-gray-700 mb-4">
              Our Service uses AI to generate content. While we strive for accuracy:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>AI-generated content may contain errors</li>
              <li>You are responsible for reviewing and editing all content</li>
              <li>We do not guarantee job placement or interview success</li>
              <li>Results may vary based on individual circumstances</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Uninterrupted or error-free service</li>
              <li>Accuracy or reliability of content</li>
              <li>Job placement or career success</li>
              <li>Compatibility with all devices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or opportunities</li>
              <li>Damages exceeding the amount you paid us</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account immediately, without prior notice, for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Non-payment of fees</li>
              <li>Any reason at our discretion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms at any time. We will notify you of
              significant changes via email or in-app notification. Continued use of the Service
              after changes constitutes acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the
              United States, without regard to conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms, please contact us:
            </p>
            <ul className="list-none text-gray-700 mb-4">
              <li>Email: support@careercopilot.com</li>
              <li>Website: careercopilot.com</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
