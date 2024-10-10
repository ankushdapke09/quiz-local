const express = require('express');
const router = express.Router();
module.exports = router;
const quizController = require('../controller/index')

// Endpoints
router.post('/quiz', quizController.createQuiz) // Endpoint to create a new quiz
router.get('/quiz/:id', quizController.getQuizById) // Endpoint to fetch a quiz by its Id
router.post('/quiz/:id/add', quizController.saveUserProgress) // Endpoint to save user progress
router.get('/quiz/:id/get', quizController.getUserProgress) // Endpoint to fetch user progress
router.post('/quiz/:id/answers', quizController.submitAnswer) // Endpoint to submit an answer for a specific question in a quiz
router.get('/quiz/:id/results', quizController.getUserResults) // Endpoint to get the user's results for a specific quiz
router.get('/users/:id/scores', quizController.getUserScores) // Endpoint to fetch historical scores of a user
