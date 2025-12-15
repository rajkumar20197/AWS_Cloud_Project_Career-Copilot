import React from 'react';
import { Button } from '../components/ui/button';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: December 19, 2024</p>

        <div className="prose prose-blue max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Career Copilot ("we," "our," or "us") respects your privacy and is committed to
              protecting your personal data. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Account information (name, email, password)</li>
              <li>Profile information (education, experience, skills)</li>
              <li>Resume and cover letter content</li>
              <li>Job preferences and search history</li>
              <li>Payment information (processed by Stripe)</li>
              <li>Communications with support</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar technologies</li>
              <li>Log files and error reports</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Provide and maintain our Service</li>
              <li>Process your transactions</li>
              <li>Generate AI-powered career content</li>
              <li>Send you notifications and updates</li>
              <li>Improve our Service and user experience</li>
              <li>Detect and prevent fraud</li>
              <li>Comply with legal obligations</li>
              <li>Respond to your requests and support inquiries</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Share Your Information</h2>
            <p className="text-gray-700 mb-4">We may share your information with:</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Service Providers</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>AWS (hosting and infrastructure)</li>
              <li>Stripe (payment processing)</li>
              <li>Google (email and calendar services)</li>
              <li>Analytics providers</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Legal Requirements</h3>
            <p className="text-gray-700 mb-4">
              We may disclose your information if required by law or to protect our rights, safety,
              or property.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Business Transfers</h3>
            <p className="text-gray-700 mb-4">
              In the event of a merger, acquisition, or sale of assets, your information may be
              transferred.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-4">We implement security measures including:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Encryption of data in transit (SSL/TLS)</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Monitoring for suspicious activity</li>
            </ul>
            <p className="text-gray-700 mb-4">
              However, no method of transmission over the Internet is 100% secure. We cannot
              guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to data processing</li>
              <li>Lodge a complaint with authorities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Remember your preferences</li>
              <li>Analyze usage patterns</li>
              <li>Improve our Service</li>
              <li>Provide personalized content</li>
            </ul>
            <p className="text-gray-700 mb-4">
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as your account is active or as needed to
              provide services. After account deletion, we may retain certain information for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Legal compliance</li>
              <li>Fraud prevention</li>
              <li>Resolving disputes</li>
              <li>Enforcing agreements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our Service is not intended for children under 13. We do not knowingly collect
              personal information from children. If you believe we have collected information from
              a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
            <p className="text-gray-700 mb-4">
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place to protect your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Third-Party Links</h2>
            <p className="text-gray-700 mb-4">
              Our Service may contain links to third-party websites. We are not responsible for
              their privacy practices. Please review their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of
              significant changes via email or in-app notification. The "Last Updated" date will be
              revised accordingly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For questions about this Privacy Policy or to exercise your rights, contact us:
            </p>
            <ul className="list-none text-gray-700 mb-4">
              <li>Email: support@careercopilot.com</li>
              <li>Website: careercopilot.com</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. GDPR Compliance (EU Users)</h2>
            <p className="text-gray-700 mb-4">
              If you are in the European Union, you have additional rights under GDPR:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Right to data portability</li>
              <li>Right to restrict processing</li>
              <li>Right to object to automated decision-making</li>
              <li>Right to lodge a complaint with supervisory authority</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. CCPA Compliance (California Users)</h2>
            <p className="text-gray-700 mb-4">
              If you are a California resident, you have rights under CCPA:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of sale of personal information</li>
              <li>Right to non-discrimination</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Note: We do not sell your personal information.
            </p>
          </section>
        </div>

        {onBack && (
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <Button variant="outline" onClick={onBack}>
              ← Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
