// Realistic mock data for class demo
export const mockJobs = [
  {
    id: 'job-1',
    title: 'Senior Software Engineer',
    company: 'Amazon',
    location: 'Seattle, WA',
    salary: '$150,000 - $200,000',
    type: 'Full-time',
    remote: 'Hybrid',
    description: 'Join our team building scalable cloud solutions using AWS services. Work on high-impact projects serving millions of customers worldwide. You will design and implement distributed systems, optimize performance, and mentor junior developers.',
    requirements: ['React', 'Node.js', 'AWS', 'TypeScript', 'DynamoDB', 'Docker', 'Kubernetes'],
    posted: '2 days ago',
    applicants: 45,
    aiScore: 92,
    matchReasons: ['Strong AWS experience', 'React expertise', 'Full-stack skills'],
    applicationStatus: 'not_applied'
  },
  {
    id: 'job-2', 
    title: 'Cloud Solutions Architect',
    company: 'Microsoft',
    location: 'Redmond, WA',
    salary: '$160,000 - $220,000',
    type: 'Full-time',
    remote: 'Remote',
    description: 'Design and implement cloud architecture solutions for enterprise clients. Lead technical discussions and drive cloud adoption strategies. Work with cutting-edge Azure and multi-cloud technologies.',
    requirements: ['AWS', 'Azure', 'Cloud Architecture', 'DevOps', 'Kubernetes', 'Terraform', 'Python'],
    posted: '1 day ago',
    applicants: 23,
    aiScore: 88,
    matchReasons: ['Cloud architecture skills', 'Multi-cloud experience', 'Leadership potential'],
    applicationStatus: 'not_applied'
  },
  {
    id: 'job-3',
    title: 'Full Stack Developer',
    company: 'Google',
    location: 'Mountain View, CA', 
    salary: '$140,000 - $180,000',
    type: 'Full-time',
    remote: 'On-site',
    description: 'Build innovative web applications using modern technologies. Collaborate with product teams to deliver exceptional user experiences. Work on products used by billions of users globally.',
    requirements: ['JavaScript', 'React', 'Python', 'GCP', 'MongoDB', 'GraphQL', 'Redis'],
    posted: '3 days ago',
    applicants: 67,
    aiScore: 85,
    matchReasons: ['Full-stack experience', 'Modern tech stack', 'Product focus'],
    applicationStatus: 'not_applied'
  },
  {
    id: 'job-4',
    title: 'DevOps Engineer',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salary: '$145,000 - $195,000', 
    type: 'Full-time',
    remote: 'Hybrid',
    description: 'Scale our global streaming platform infrastructure. Implement CI/CD pipelines and monitoring solutions. Help deliver entertainment to 200+ million subscribers worldwide.',
    requirements: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python', 'Jenkins', 'Prometheus'],
    posted: '1 week ago',
    applicants: 34,
    aiScore: 90,
    matchReasons: ['AWS expertise', 'Infrastructure skills', 'Scalability focus'],
    applicationStatus: 'applied'
  },
  {
    id: 'job-5',
    title: 'AI/ML Engineer', 
    company: 'OpenAI',
    location: 'San Francisco, CA',
    salary: '$170,000 - $250,000',
    type: 'Full-time', 
    remote: 'Hybrid',
    description: 'Develop and deploy machine learning models at scale. Work on cutting-edge AI research and applications. Help build the future of artificial intelligence.',
    requirements: ['Python', 'TensorFlow', 'AWS Bedrock', 'MLOps', 'Statistics', 'PyTorch', 'Kubernetes'],
    posted: '4 days ago',
    applicants: 89,
    aiScore: 78,
    matchReasons: ['AI/ML interest', 'Python skills', 'AWS Bedrock knowledge'],
    applicationStatus: 'not_applied'
  },
  {
    id: 'job-6',
    title: 'Frontend Developer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    salary: '$130,000 - $170,000',
    type: 'Full-time',
    remote: 'Hybrid',
    description: 'Build user interfaces for billions of users across Facebook, Instagram, and WhatsApp. Work with React, GraphQL, and cutting-edge web technologies.',
    requirements: ['React', 'JavaScript', 'TypeScript', 'GraphQL', 'CSS', 'Jest', 'Webpack'],
    posted: '5 days ago',
    applicants: 156,
    aiScore: 87,
    matchReasons: ['React expertise', 'Frontend focus', 'Large scale experience'],
    applicationStatus: 'not_applied'
  },
  {
    id: 'job-7',
    title: 'Backend Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    salary: '$155,000 - $205,000',
    type: 'Full-time',
    remote: 'Remote',
    description: 'Build and scale payment infrastructure that powers millions of businesses worldwide. Work on distributed systems, APIs, and financial technology.',
    requirements: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'AWS', 'Microservices', 'API Design'],
    posted: '6 days ago',
    applicants: 78,
    aiScore: 83,
    matchReasons: ['Backend expertise', 'API experience', 'Scalability skills'],
    applicationStatus: 'not_applied'
  },
  {
    id: 'job-8',
    title: 'Site Reliability Engineer',
    company: 'Uber',
    location: 'San Francisco, CA',
    salary: '$150,000 - $200,000',
    type: 'Full-time',
    remote: 'Hybrid',
    description: 'Ensure reliability and performance of systems serving millions of rides daily. Implement monitoring, alerting, and incident response procedures.',
    requirements: ['AWS', 'Kubernetes', 'Prometheus', 'Grafana', 'Python', 'Go', 'Linux'],
    posted: '1 week ago',
    applicants: 42,
    aiScore: 89,
    matchReasons: ['Infrastructure skills', 'Monitoring experience', 'Reliability focus'],
    applicationStatus: 'not_applied'
  }
];

export const mockApplications = [
  {
    id: 'app-1',
    jobId: 'job-4',
    jobTitle: 'DevOps Engineer',
    company: 'Netflix',
    status: 'Interview Scheduled',
    appliedDate: '2024-12-15',
    lastUpdate: '2024-12-18',
    nextStep: 'Technical Interview - Dec 22, 2024',
    notes: 'Completed phone screening. Technical round with senior engineers focusing on AWS and Kubernetes.',
    interviewDate: '2024-12-22',
    salary: '$145,000 - $195,000',
    location: 'Los Gatos, CA'
  },
  {
    id: 'app-2', 
    jobId: 'job-2',
    jobTitle: 'Cloud Solutions Architect',
    company: 'Microsoft',
    status: 'Under Review',
    appliedDate: '2024-12-10',
    lastUpdate: '2024-12-16',
    nextStep: 'Waiting for recruiter response',
    notes: 'Application submitted with portfolio. Strong match for requirements. Expecting response by end of week.',
    salary: '$160,000 - $220,000',
    location: 'Redmond, WA'
  },
  {
    id: 'app-3',
    jobId: 'job-1', 
    jobTitle: 'Senior Software Engineer',
    company: 'Amazon',
    status: 'Offer Received',
    appliedDate: '2024-12-01',
    lastUpdate: '2024-12-19',
    nextStep: 'Review offer details',
    notes: 'Completed all interview rounds. Competitive offer received. Need to respond by Dec 26.',
    offerAmount: '$175,000',
    offerDeadline: '2024-12-26',
    salary: '$150,000 - $200,000',
    location: 'Seattle, WA'
  },
  {
    id: 'app-4',
    jobId: 'job-5',
    jobTitle: 'AI/ML Engineer',
    company: 'OpenAI',
    status: 'Rejected',
    appliedDate: '2024-11-28',
    lastUpdate: '2024-12-12',
    nextStep: 'Apply to similar roles',
    notes: 'Made it to final round but position went to internal candidate. Positive feedback on technical skills.',
    salary: '$170,000 - $250,000',
    location: 'San Francisco, CA'
  }
];

export const mockMarketData = {
  salaryTrends: [
    { role: 'Software Engineer', avgSalary: 150000, trend: 8.5, location: 'San Francisco' },
    { role: 'Cloud Architect', avgSalary: 180000, trend: 12.3, location: 'Seattle' },
    { role: 'DevOps Engineer', avgSalary: 145000, trend: 15.7, location: 'Austin' },
    { role: 'Frontend Developer', avgSalary: 135000, trend: 6.2, location: 'New York' },
    { role: 'Backend Engineer', avgSalary: 155000, trend: 9.8, location: 'San Francisco' }
  ],
  skillDemand: [
    { skill: 'AWS', demand: 95, growth: 18.2 },
    { skill: 'React', demand: 88, growth: 12.5 },
    { skill: 'Python', demand: 92, growth: 14.8 },
    { skill: 'Kubernetes', demand: 85, growth: 22.1 },
    { skill: 'TypeScript', demand: 82, growth: 16.3 },
    { skill: 'Docker', demand: 78, growth: 11.7 }
  ],
  industryTrends: [
    { industry: 'Technology', jobCount: 15420, avgSalary: 145000, growth: 12.5 },
    { industry: 'Finance', jobCount: 8930, avgSalary: 125000, growth: 8.2 },
    { industry: 'Healthcare', jobCount: 6750, avgSalary: 95000, growth: 15.8 },
    { industry: 'E-commerce', jobCount: 5240, avgSalary: 135000, growth: 18.3 }
  ]
};

export const mockInterviewQuestions = [
  "Tell me about yourself and your experience with cloud technologies.",
  "How would you design a scalable web application using AWS services?",
  "Explain the difference between DynamoDB and RDS. When would you use each?",
  "Walk me through how you would implement CI/CD for a React application.",
  "How do you handle error handling and logging in a distributed system?",
  "Describe a challenging technical problem you solved recently.",
  "How would you optimize the performance of a slow database query?",
  "What's your experience with containerization and orchestration?",
  "How do you stay updated with new technologies and best practices?",
  "Tell me about a time you had to work with a difficult team member."
];

export const mockSkillGaps = [
  {
    skill: 'Kubernetes',
    currentLevel: 60,
    targetLevel: 85,
    importance: 'High',
    timeToLearn: '3-4 months',
    resources: [
      'Kubernetes Official Documentation',
      'Certified Kubernetes Administrator (CKA) Course',
      'Hands-on practice with minikube'
    ]
  },
  {
    skill: 'System Design',
    currentLevel: 70,
    targetLevel: 90,
    importance: 'Critical',
    timeToLearn: '2-3 months',
    resources: [
      'Designing Data-Intensive Applications book',
      'System Design Interview courses',
      'Practice with real-world scenarios'
    ]
  },
  {
    skill: 'Machine Learning',
    currentLevel: 40,
    targetLevel: 75,
    importance: 'Medium',
    timeToLearn: '6-8 months',
    resources: [
      'Andrew Ng Machine Learning Course',
      'Hands-on ML with Scikit-Learn and TensorFlow',
      'Kaggle competitions'
    ]
  }
];

// User profile for demo
export const mockUser = {
  id: 'user-demo',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  careerStage: 'professional',
  skills: ['React', 'Node.js', 'AWS', 'TypeScript', 'DynamoDB', 'Python', 'Docker'],
  experience: '3 years',
  preferences: {
    jobAlerts: true,
    emailNotifications: true,
    locations: ['San Francisco', 'Seattle', 'Remote'],
    industries: ['Technology', 'Startups', 'Cloud Computing'],
    salaryRange: { min: 120000, max: 200000 },
    remotePreference: 'hybrid'
  },
  profile: {
    bio: 'Passionate full-stack developer with expertise in cloud technologies and modern web development. Experience building scalable applications using AWS services.',
    education: 'BS Computer Science',
    currentRole: 'Software Engineer',
    yearsExperience: 3
  }
};