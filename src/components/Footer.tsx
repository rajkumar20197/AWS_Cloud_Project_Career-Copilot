import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Career Copilot</h3>
            <p className="text-sm mb-4">
              AI-powered career platform helping students and professionals land their dream jobs.
            </p>
            <div className="flex gap-4">
              <a href="mailto:support@careercopilot.com" className="hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="/support" className="hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="hover:text-white transition-colors">
                  Video Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-center md:text-left">
              <p>© {currentYear} Career Copilot. All rights reserved.</p>
              <p className="text-gray-500 mt-1">
                Made with <Heart className="w-4 h-4 inline text-red-500" /> for job seekers
                everywhere
              </p>
            </div>

            <div className="flex gap-6 text-sm">
              <Link to="/support" className="hover:text-white transition-colors">
                Support
              </Link>
              <Link to="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
              <Link to="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-xs text-gray-500 text-center">
            <p>
              Career Copilot and the Career Copilot logo are trademarks of Career Copilot, Inc.
            </p>
            <p className="mt-2">
              All product names, logos, and brands are property of their respective owners. All
              company, product and service names used in this website are for identification
              purposes only. Use of these names, logos, and brands does not imply endorsement.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
