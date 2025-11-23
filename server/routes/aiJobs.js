const express = require('express');
const router = express.Router();
const JobGenerationService = require('../services/jobGenerationService');

// POST /api/ai-jobs/generate - Generate personalized jobs
router.post('/generate', async (req, res, next) => {
  try {
    const { userProfile, count = 10 } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'userProfile is required' });
    }

    const jobs = await JobGenerationService.generateJobs(userProfile, count);

    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/ai-jobs/applications - Generate applications
router.post('/applications', async (req, res, next) => {
  try {
    const { userProfile, count = 5 } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'userProfile is required' });
    }

    const applications = await JobGenerationService.generateApplications(userProfile, count);

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/ai-jobs/offers - Generate offer comparisons
router.post('/offers', async (req, res, next) => {
  try {
    const { userProfile, count = 2 } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: 'userProfile is required' });
    }

    const offers = await JobGenerationService.generateOffers(userProfile, count);

    res.json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
