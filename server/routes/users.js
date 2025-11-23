const express = require('express');
const router = express.Router();
const DynamoService = require('../services/dynamoService');

// POST /api/users/profile - Create or update user profile
router.post('/profile', async (req, res, next) => {
  try {
    const { userId, email, name, profile } = req.body;

    if (!userId || !email || !name) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, email, name' 
      });
    }

    const profileData = {
      email,
      name,
      currentRole: profile?.currentRole,
      targetRole: profile?.targetRole,
      skills: profile?.skills || [],
      experience: profile?.experience,
      graduationDate: profile?.graduationDate,
      location: profile?.location,
      salaryExpectation: profile?.salaryExpectation,
    };

    const result = await DynamoService.saveUserProfile(userId, profileData);
    
    res.json({
      success: true,
      message: 'Profile saved successfully',
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/profile/:userId - Get user profile
router.get('/profile/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const result = await DynamoService.getUserProfile(userId);
    
    if (!result.success || !result.user) {
      return res.status(404).json({ 
        error: 'User profile not found' 
      });
    }

    res.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/profile/email/:email - Get user by email
router.get('/profile/email/:email', async (req, res, next) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    const result = await DynamoService.getUserByEmail(email);
    
    if (!result.success || !result.user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/profile/:userId - Update user profile
router.put('/profile/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    const result = await DynamoService.updateUserProfile(userId, updates);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/users/jobs - Save job for user
router.post('/jobs', async (req, res, next) => {
  try {
    const { userId, job } = req.body;

    if (!userId || !job) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, job' 
      });
    }

    const result = await DynamoService.saveJob(userId, job);
    
    res.json({
      success: true,
      message: 'Job saved successfully',
      job: result.job,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:userId/jobs - Get saved jobs
router.get('/:userId/jobs', async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const result = await DynamoService.getUserJobs(userId);
    
    res.json({
      success: true,
      jobs: result.jobs,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/users/applications - Create application
router.post('/applications', async (req, res, next) => {
  try {
    const { userId, jobId, application } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, jobId' 
      });
    }

    const result = await DynamoService.createApplication(userId, jobId, application || {});
    
    res.json({
      success: true,
      message: 'Application created successfully',
      application: result.application,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:userId/applications - Get user applications
router.get('/:userId/applications', async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const result = await DynamoService.getUserApplications(userId);
    
    res.json({
      success: true,
      applications: result.applications,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/applications/:applicationId - Update application
router.put('/applications/:applicationId', async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const updates = req.body;

    if (!applicationId) {
      return res.status(400).json({ error: 'applicationId is required' });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    const result = await DynamoService.updateApplication(applicationId, updates);
    
    res.json({
      success: true,
      message: 'Application updated successfully',
      application: result.application,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/health - Health check for DynamoDB
router.get('/health', async (req, res, next) => {
  try {
    const tables = await DynamoService.checkTablesExist();
    
    res.json({
      success: true,
      tables,
      message: 'DynamoDB service is healthy',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
