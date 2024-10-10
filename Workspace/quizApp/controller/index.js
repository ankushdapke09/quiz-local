const quizData = require('../service/quizDetails'); // Import quizDetails module
const progressData = require('../service/progressData'); // Import progressData module

/**
 * Create a quiz.
 * @param {object} req - Req for a Quiz.
 * @param {object} res - Res for a Quiz.
 */
exports.createQuiz = (req, res) => {
    try {
        const { id, title, questions } = req.body;
        // Validate inputs
        if (!title || !Array.isArray(questions)) {
            return res.status(400).json({ message: 'Invalid input' });
        }
        // Create and store the quiz data
        const quiz = quizData.createQuiz(id, title, questions);
        res.status(201).json(quiz);
    } catch (error) {
        console.error('Error  while creating quiz:', error.message);
        res.status(500).json({ error: 'Failed to create quiz' });
    }
};

/**
 * Fetch a quiz by its Id.
 * @param {object} req - Req for a Quiz.
 * @param {object} res - Res for a Quiz.
 */
exports.getQuizById = (req, res) => {
    try {
        const quizId = parseInt(req.params.id);
        const quiz = quizData.getQuizById(quizId);
        // Return 404 if quiz not found
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz Data not found' });
        }
        // Prepare and send quiz data without revealing correct answers
        res.json(quizData.prepareQuizForClient(quiz));
    } catch (error) {
        console.error('Error while fetching quiz:', error.message);
        res.status(500).json({ error: 'Failed to fetch quiz' });
    }
};

/**
 * Save user progress.
 * @param {object} req - Req to save a user progress.
 * @param {object} res - Res to save a user progress.
 */
exports.saveUserProgress = (req, res) => {
    try {
        const quizId = parseInt(req.params.id);
        const { user_id, question_id, selected_option } = req.body;

        // Validate input
        if (!user_id || typeof question_id !== 'number' || typeof selected_option !== 'number') {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const progress = progressData.saveUserProgress(quizId, parseInt(user_id), question_id, selected_option);

        if (progress.error) {
            return res.status(progress.status).json({ message: progress.error });
        }

        res.json({ message: 'User Progress saved successfully', progress });
    } catch (error) {
        console.error('Error while submitting answer:', error.message);
        res.status(500).json({ error: 'Failed to submit answer' });
    }
};

/**
 * Get user progress.
 * @param {object} req - Req to get a user progress.
 * @param {object} res - Res to get a user progress.
 */
exports.getUserProgress = (req, res) => {
    try {
        const quizId = parseInt(req.params.id);
        const userId = parseInt(req.query.user_id);

        const userProgress = progressData.getUserProgress(quizId, userId);

        if (!userProgress) {
            return res.status(404).json({ message: 'No progress found for this user' });
        }

        res.json(userProgress);
    } catch (error) {
        console.error('Error while fetching user progress:', error.message);
        res.status(500).json({ error: 'Failed to fetch user progress' });
    }
};

/**
 * Submit an answer for a specific question in a quiz.
 * @param {object} req - Req to submit a answer.
 * @param {object} res - Res to submit a answer.
 */
exports.submitAnswer = (req, res) => {
    try {
        const quizId = parseInt(req.params.id);
        const user_id = parseInt(req.body.user_id);
        const { question_id, selected_option } = req.body;

        // Validate input
        if (typeof question_id !== 'number' || typeof selected_option !== 'number') {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const result = quizData.submitAnswer(quizId, question_id, selected_option, user_id);

        if (result.error) {
            return res.status(result.status).json({ message: result.error });
        }

        // Respond with feedback on the answer
        res.json(result);
    } catch (error) {
        console.error('Error while submitting answer:', error.message);
        res.status(500).json({ error: 'Failed to submit answer' });
    }
};

/**
 * Get user Results for a specific quiz.
 * @param {object} req - Req to get a user result.
 * @param {object} res - Res to get a user result.
 */
exports.getUserResults = (req, res) => {
    try {
        const quizId = parseInt(req.params.id);
        const userId = parseInt(req.query.user_id);

        // Fetch results for the user
        const userResults = quizData.getUserResults(quizId, userId);

        if (!userResults) {
            return res.status(404).json({ message: 'Results not found for this user' });
        }

        // Respond with the user's results
        res.json(userResults);
    } catch (error) {
        console.error('Error while getting user result:', error.message);
        res.status(500).json({ error: 'Failed to get user result' });
    }
};

/**
 * Get a user Score.
 * @param {object} req - Req to get a user score.
 * @param {object} res - Res to get a user score.
 */
exports.getUserScores = (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const scores = progressData.getUserScores(userId);

        if (!scores || scores.length === 0) {
            return res.status(404).json({ message: 'No historical scores found for this user' });
        }
        res.json(scores);
    } catch (error) {
        console.error('Error while getting user score:', error.message);
        res.status(500).json({ error: 'Failed to get user score' });
    }
};