// Study Materials Database
// Curated learning resources by major

const studyMaterials = {
  'Computer Science': [
    {
      id: 'm1',
      title: 'Data Structures & Algorithms',
      description: 'Master fundamental data structures and algorithms essential for technical interviews',
      resources: [
        { 
          name: 'LeetCode Explore', 
          url: 'https://leetcode.com/explore/', 
          type: 'Practice',
          description: 'Interactive coding challenges'
        },
        { 
          name: 'Visualgo', 
          url: 'https://visualgo.net/', 
          type: 'Visualization',
          description: 'Animated algorithm visualizations'
        },
        { 
          name: 'GeeksforGeeks DSA', 
          url: 'https://www.geeksforgeeks.org/data-structures/', 
          type: 'Tutorial',
          description: 'Comprehensive tutorials and examples'
        },
        {
          name: 'NeetCode',
          url: 'https://neetcode.io/',
          type: 'Course',
          description: 'Curated problem lists with video solutions'
        }
      ],
      topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting', 'Searching', 'Dynamic Programming'],
      estimatedHours: 40,
      difficulty: 'Intermediate'
    },
    {
      id: 'm2',
      title: 'System Design Fundamentals',
      description: 'Learn to design scalable, distributed systems for technical interviews',
      resources: [
        { 
          name: 'System Design Primer', 
          url: 'https://github.com/donnemartin/system-design-primer', 
          type: 'Guide',
          description: 'Comprehensive system design guide'
        },
        { 
          name: 'ByteByteGo', 
          url: 'https://bytebytego.com/', 
          type: 'Course',
          description: 'Visual system design explanations'
        },
        {
          name: 'Designing Data-Intensive Applications',
          url: 'https://dataintensive.net/',
          type: 'Book',
          description: 'Deep dive into distributed systems'
        }
      ],
      topics: ['Scalability', 'Load Balancing', 'Caching', 'Databases', 'Microservices', 'CAP Theorem'],
      estimatedHours: 30,
      difficulty: 'Advanced'
    },
    {
      id: 'm3',
      title: 'Web Development',
      description: 'Build modern, responsive web applications with latest technologies',
      resources: [
        { 
          name: 'MDN Web Docs', 
          url: 'https://developer.mozilla.org/', 
          type: 'Documentation',
          description: 'Complete web development reference'
        },
        { 
          name: 'freeCodeCamp', 
          url: 'https://www.freecodecamp.org/', 
          type: 'Course',
          description: 'Free interactive coding bootcamp'
        },
        { 
          name: 'React Documentation', 
          url: 'https://react.dev/', 
          type: 'Documentation',
          description: 'Official React learning resources'
        },
        {
          name: 'The Odin Project',
          url: 'https://www.theodinproject.com/',
          type: 'Course',
          description: 'Full-stack web development curriculum'
        }
      ],
      topics: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'REST APIs', 'TypeScript'],
      estimatedHours: 50,
      difficulty: 'Beginner'
    },
    {
      id: 'm4',
      title: 'Cloud Computing (AWS)',
      description: 'Master cloud services and infrastructure with AWS',
      resources: [
        {
          name: 'AWS Free Tier',
          url: 'https://aws.amazon.com/free/',
          type: 'Platform',
          description: 'Hands-on practice with AWS services'
        },
        {
          name: 'AWS Skill Builder',
          url: 'https://skillbuilder.aws/',
          type: 'Course',
          description: 'Official AWS training courses'
        },
        {
          name: 'A Cloud Guru',
          url: 'https://acloudguru.com/',
          type: 'Course',
          description: 'Cloud certification preparation'
        }
      ],
      topics: ['EC2', 'S3', 'Lambda', 'DynamoDB', 'CloudFormation', 'IAM', 'VPC'],
      estimatedHours: 35,
      difficulty: 'Intermediate'
    },
    {
      id: 'm5',
      title: 'Database Design',
      description: 'Learn SQL, NoSQL, and database optimization techniques',
      resources: [
        {
          name: 'SQLBolt',
          url: 'https://sqlbolt.com/',
          type: 'Tutorial',
          description: 'Interactive SQL lessons'
        },
        {
          name: 'MongoDB University',
          url: 'https://university.mongodb.com/',
          type: 'Course',
          description: 'Free MongoDB courses'
        },
        {
          name: 'Database Design Course',
          url: 'https://www.coursera.org/learn/database-design',
          type: 'Course',
          description: 'Database modeling and design'
        }
      ],
      topics: ['SQL', 'NoSQL', 'Indexing', 'Normalization', 'Transactions', 'Query Optimization'],
      estimatedHours: 25,
      difficulty: 'Intermediate'
    },
    {
      id: 'm6',
      title: 'Git & Version Control',
      description: 'Master Git for collaborative software development',
      resources: [
        {
          name: 'Git Documentation',
          url: 'https://git-scm.com/doc',
          type: 'Documentation',
          description: 'Official Git documentation'
        },
        {
          name: 'Learn Git Branching',
          url: 'https://learngitbranching.js.org/',
          type: 'Interactive',
          description: 'Visual and interactive Git tutorial'
        },
        {
          name: 'GitHub Skills',
          url: 'https://skills.github.com/',
          type: 'Course',
          description: 'GitHub-specific features and workflows'
        }
      ],
      topics: ['Git Basics', 'Branching', 'Merging', 'Pull Requests', 'Collaboration', 'CI/CD'],
      estimatedHours: 15,
      difficulty: 'Beginner'
    }
  ],
  'Software Engineering': [
    {
      id: 'm7',
      title: 'Software Design Patterns',
      description: 'Learn common design patterns for writing maintainable code',
      resources: [
        {
          name: 'Refactoring Guru',
          url: 'https://refactoring.guru/design-patterns',
          type: 'Tutorial',
          description: 'Visual design pattern explanations'
        },
        {
          name: 'Design Patterns Book',
          url: 'https://www.oreilly.com/library/view/head-first-design/0596007124/',
          type: 'Book',
          description: 'Head First Design Patterns'
        }
      ],
      topics: ['Singleton', 'Factory', 'Observer', 'Strategy', 'Decorator', 'MVC'],
      estimatedHours: 20,
      difficulty: 'Intermediate'
    },
    {
      id: 'm8',
      title: 'Testing & Quality Assurance',
      description: 'Write reliable tests and ensure code quality',
      resources: [
        {
          name: 'Jest Documentation',
          url: 'https://jestjs.io/',
          type: 'Documentation',
          description: 'JavaScript testing framework'
        },
        {
          name: 'Testing JavaScript',
          url: 'https://testingjavascript.com/',
          type: 'Course',
          description: 'Comprehensive testing course'
        }
      ],
      topics: ['Unit Testing', 'Integration Testing', 'E2E Testing', 'TDD', 'Mocking'],
      estimatedHours: 18,
      difficulty: 'Intermediate'
    }
  ],
  'Data Science': [
    {
      id: 'm9',
      title: 'Python for Data Science',
      description: 'Master Python libraries for data analysis and machine learning',
      resources: [
        {
          name: 'Kaggle Learn',
          url: 'https://www.kaggle.com/learn',
          type: 'Course',
          description: 'Free data science courses'
        },
        {
          name: 'Python Data Science Handbook',
          url: 'https://jakevdp.github.io/PythonDataScienceHandbook/',
          type: 'Book',
          description: 'Free online book'
        }
      ],
      topics: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn', 'Data Cleaning'],
      estimatedHours: 40,
      difficulty: 'Intermediate'
    }
  ]
};

/**
 * Get materials by major
 */
function getMaterialsByMajor(major) {
  // Return materials for the major, or default to Computer Science
  return studyMaterials[major] || studyMaterials['Computer Science'];
}

/**
 * Get all available majors
 */
function getAllMajors() {
  return Object.keys(studyMaterials);
}

/**
 * Get material by ID
 */
function getMaterialById(materialId) {
  for (const major in studyMaterials) {
    const material = studyMaterials[major].find(m => m.id === materialId);
    if (material) return material;
  }
  return null;
}

/**
 * Search materials by topic
 */
function searchMaterialsByTopic(topic) {
  const results = [];
  for (const major in studyMaterials) {
    const materials = studyMaterials[major].filter(m => 
      m.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
    );
    results.push(...materials);
  }
  return results;
}

module.exports = {
  getMaterialsByMajor,
  getAllMajors,
  getMaterialById,
  searchMaterialsByTopic
};
