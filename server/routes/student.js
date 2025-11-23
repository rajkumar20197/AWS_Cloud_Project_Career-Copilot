const express = require('express');
const router = express.Router();
const { getDailyQuestion, getQuestionByDifficulty, getAllQuestions } = require('../data/interviewQuestions');
const { getMaterialsByMajor, getAllMajors, searchMaterialsByTopic } = require('../data/studyMaterials');

// ==================== INTERVIEW QUESTIONS ====================

/**
 * GET /api/student/daily-question
 * Get the daily interview question (rotates automatically)
 */
router.get('/daily-question', (req, res) => {
  try {
    const question = getDailyQuestion();
    res.json({
      success: true,
      question
    });
  } catch (error) {
    console.error('Error getting daily question:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/student/questions
 * Get all interview questions
 */
router.get('/questions', (req, res) => {
  try {
    const { difficulty } = req.query;
    
    let questions;
    if (difficulty) {
      questions = [getQuestionByDifficulty(difficulty)];
    } else {
      questions = getAllQuestions();
    }
    
    res.json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/student/question/:difficulty
 * Get a random question by difficulty
 */
router.get('/question/:difficulty', (req, res) => {
  try {
    const { difficulty } = req.params;
    const question = getQuestionByDifficulty(difficulty);
    
    res.json({
      success: true,
      question
    });
  } catch (error) {
    console.error('Error getting question by difficulty:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ==================== STUDY MATERIALS ====================

/**
 * GET /api/student/study-materials/:major
 * Get study materials for a specific major
 */
router.get('/study-materials/:major', (req, res) => {
  try {
    const { major } = req.params;
    const materials = getMaterialsByMajor(major);
    
    res.json({
      success: true,
      major,
      count: materials.length,
      materials
    });
  } catch (error) {
    console.error('Error getting study materials:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/student/majors
 * Get all available majors
 */
router.get('/majors', (req, res) => {
  try {
    const majors = getAllMajors();
    
    res.json({
      success: true,
      majors
    });
  } catch (error) {
    console.error('Error getting majors:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/student/search-materials
 * Search materials by topic
 */
router.get('/search-materials', (req, res) => {
  try {
    const { topic } = req.query;
    
    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'Topic query parameter is required'
      });
    }
    
    const materials = searchMaterialsByTopic(topic);
    
    res.json({
      success: true,
      topic,
      count: materials.length,
      materials
    });
  } catch (error) {
    console.error('Error searching materials:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ==================== PROGRESS TRACKING ====================

/**
 * POST /api/student/track-session
 * Track a study session
 */
router.post('/track-session', async (req, res) => {
  try {
    const { userId, topic, duration, completed } = req.body;
    
    if (!userId || !topic || !duration) {
      return res.status(400).json({
        success: false,
        error: 'userId, topic, and duration are required'
      });
    }
    
    // TODO: Save to DynamoDB when ready
    // For now, just return success
    
    res.json({
      success: true,
      message: 'Study session tracked',
      session: {
        userId,
        topic,
        duration,
        completed,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error tracking session:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * POST /api/student/submit-answer
 * Submit an answer to a question
 */
router.post('/submit-answer', async (req, res) => {
  try {
    const { userId, questionId, answer, timeTaken, correct } = req.body;
    
    if (!userId || !questionId) {
      return res.status(400).json({
        success: false,
        error: 'userId and questionId are required'
      });
    }
    
    // TODO: Save to DynamoDB and update user progress
    // For now, just return success
    
    res.json({
      success: true,
      message: 'Answer submitted',
      submission: {
        userId,
        questionId,
        timeTaken,
        correct,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
