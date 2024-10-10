// In-memory data storage for user progress
let userProgress = [];
let userScores = [];

/**
 * Save the user's progress for a quiz.
 * @param {number} quizId - The ID of the quiz.
 * @param {string} user_id - The ID of the user.
 * @param {number} question_id - The ID of the question being answered.
 * @param {number} selected_option - The selected answer option index.
 * @returns {Object} - The progress object or error.
 */
const saveUserProgress = (quizId, user_id, question_id, selected_option) => {
    if (!quizId || !user_id || !question_id === undefined || selected_option === undefined) {
        throw new Error("Invalid progress data");
    }
    // Check if the user already has progress for this quiz
    let progress = userProgress.find(p => p.quiz_id === quizId && p.user_id === user_id);

    if (!progress) {
        // Create a new progress entry if it doesn't exist
        progress = {
            quiz_id: quizId,
            user_id,
            answers: []
        };
        userProgress.push(progress);
    }

    // Check if the answer for this question is already recorded
    const existingAnswer = progress.answers.find(a => a.question_id === question_id);
    if (existingAnswer) {
        throw new Error("Answer already saved");
    }

    // Save the user's answer in progress
    progress.answers.push({ question_id, selected_option });

    return progress; // Return updated progress
};

/**
 * Get the user's progress for a specific quiz.
 * @param {number} quizId - The ID of the quiz.
 * @param {string} userId - The ID of the user.
 * @returns {Object|null} - The user's progress object or null if not found.
 */
const getUserProgress = (quizId, userId) => {
    
    if (!quizId) {
        throw new Error("Please provide quiz-Id");
    }
    if (!userId) {
        throw new Error("Please provide userId");
    }
    return userProgress.find(p => p.quiz_id === quizId && p.user_id === userId) || null;
};

/**
 * Get the user's historical scores.
 * @param {string} userId - The ID of the user.
 * @returns {Array} - The list of historical scores for the user.
 */
const getUserScores = (userId) => {
    if (!userId) {
        throw new Error("Please provide userId");
    }
    return userScores.find(score => score.user_id === userId);
};

/**
 * Save a user's score after finishing the quiz.
 * @param {number} quizId - The ID of the quiz.
 * @param {string} user_id - The ID of the user.
 * @param {number} score - The user's score.
 */
const saveUserScore = (quizId, user_id, score) => {

    userScores.push({
        quiz_id: quizId,
        user_id,
        score,
        date: new Date().toISOString() // Store the date of the score
    });
};

module.exports = {
    saveUserProgress,
    getUserProgress,
    getUserScores,
    saveUserScore
};
