import React, { useState } from 'react';
import { Search, Book, Video, HelpCircle, ChevronRight, ExternalLink } from 'lucide-react';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: 'Getting Started',
      icon: <Book className="w-6 h-6" />,
      articles: [
        { title: 'How to create an account', views: '1.2k' },
        { title: 'Setting up your profile', views: '980' },
        { title: 'Understanding subscription plans', views: '850' },
        { title: 'First steps with Career Copilot', views: '1.5k' },
      ],
    },
    {
      title: 'Resume Builder',
      icon: <Book className="w-6 h-6" />,
      articles: [
        { title: 'Creating your first resume', views: '2.1k' },
        { title: 'Using AI to optimize your resume', views: '1.8k' },
        { title: 'Choosing the right template', views: '920' },
        { title: 'Exporting your resume', views: '1.1k' },
      ],
    },
    {
      title: 'Job Search',
      icon: <Search className="w-6 h-6" />,
      articles: [
        { title: 'How job matching works', views: '1.6k' },
        { title: 'Saving and tracking applications', views: '1.3k' },
        { title: 'Setting job preferences', views: '890' },
        { title: 'Understanding job recommendations', views: '1.0k' },
      ],
    },
    {
      title: 'Interview Prep',
      icon: <Video className="w-6 h-6" />,
      articles: [
        { title: 'Preparing for technical interviews', views: '2.3k' },
        { title: 'Common behavioral questions', views: '1.9k' },
        { title: 'Using the AI interview coach', views: '1.4k' },
        { title: 'Scheduling practice sessions', views: '780' },
      ],
    },
    {
      title: 'Billing & Payments',
      icon: <HelpCircle className="w-6 h-6" />,
      articles: [
        { title: 'How to upgrade your plan', views: '1.1k' },
        { title: 'Managing your subscription', views: '950' },
        { title: 'Canceling your subscription', views: '680' },
        { title: 'Refund policy', views: '540' },
      ],
    },
    {
      title: 'Account Settings',
      icon: <Book className="w-6 h-6" />,
      articles: [
        { title: 'Changing your password', views: '820' },
        { title: 'Updating profile information', views: '710' },
        { title: 'Email preferences', views: '590' },
        { title: 'Deleting your account', views: '450' },
      ],
    },
  ];

  const popularArticles = [
    { title: 'How to create an account', category: 'Getting Started', views: '1.2k' },
    { title: 'Creating your first resume', category: 'Resume Builder', views: '2.1k' },
    { title: 'Preparing for technical interviews', category: 'Interview Prep', views: '2.3k' },
    { title: 'How job matching works', category: 'Job Search', views: '1.6k' },
    { title: 'How to upgrade your plan', category: 'Billing', views: '1.1k' },
  ];

  const videoTutorials = [
    { title: 'Getting Started with Career Copilot', duration: '5:30', thumbnail: '🎬' },
    { title: 'Building Your Perfect Resume', duration: '8:15', thumbnail: '📝' },
    { title: 'Mastering the Job Search', duration: '6:45', thumbnail: '🔍' },
    { title: 'Interview Prep Tips', duration: '10:20', thumbnail: '🎤' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to your questions and learn how to make the most of Career Copilot
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Popular Articles */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-all group"
              >
                <div className="flex items-center flex-1">
                  <Book className="w-5 h-5 text-blue-500 mr-3" />
                  <div>
                    <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500">{article.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{article.views} views</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Video Tutorials</h2>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center">
              View all <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {videoTutorials.map((video, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-3xl mr-4">
                  {video.thumbnail}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-blue-600 transition-colors mb-1">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-500">{video.duration}</p>
                </div>
                <Video className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold">{category.title}</h3>
              </div>
              <ul className="space-y-3">
                {category.articles.map((article, articleIndex) => (
                  <li key={articleIndex}>
                    <a
                      href="#"
                      className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition-colors group"
                    >
                      <span className="text-sm">{article.title}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="mb-6">
            Can't find what you're looking for? Our support team is here to help!
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
      </div>
    </div>
  );
}
