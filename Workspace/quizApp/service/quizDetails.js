const progressData = require('../service/progressData')
// Using In-memory data storage
let quizzes = [];
let results = [];

/**
 * Create a new quiz object.
 * @param {string} title - The title of the quiz.
 * @param {Array} questions - The questions for the quiz.
 * @returns {Object} - The newly created quiz object.
 */
const createQuiz = (id, title, questions) => {
    const quizObj = {
        id,
        title,
        questions: questions.map(q => createQuestion(q.id, q.text, q.options, q.correct_option))
    };
    quizzes.push(quizObj)
    return quizObj
};

/**
 * Create a new question object.
 * @param {string} text - The text of the question.
 * @param {Array} options - The answer options for the question.
 * @param {number} correct_option - The index of the correct answer.
 * @returns {Object} - The newly created question object.
 */
const createQuestion = (id, text, options, correct_option) => {
    return {
        id,
        text,
        options,
        correct_option
    };
};

/**
 * Prepare the quiz data for client-side use by omitting correct answers.
 * @param {Object} quiz - The quiz object.
 * @returns {Object} - The prepared quiz object.
 */
const prepareQuizForClient = (quiz) => {
    return {
        id: quiz.id,
        title: quiz.title,
        questions: quiz.questions.map(q => ({
            id: q.id,
            text: q.text,
            options: q.options
        }))
    };
};

/**
 * Submit an answer for a specific question in a quiz.
 * @param {number} quizId - The ID of the quiz.
 * @param {number} question_id - The ID of the question answered.
 * @param {number} selected_option - The selected answer option index.
 * @param {string} user_id - The ID of the user submitting the answer.
 * @returns {Object} - Feedback on the answer submission.
 */

const submitAnswer = (quizId, question_id, selected_option, user_id) => {
    const quiz = quizzes.find(q => q.id === quizId);

    // Return error if quiz not found
    if (!quiz) {
        return { error: 'Quiz not found', status: 404 };
    }

    const question = quiz.questions.find(q => q.id === question_id);

    // Return error if question not found
    if (!question) {
        return { error: 'Question not found', status: 404 };
    }

    // Check if the selected answer is correct
    const isCorrect = selected_option === question.correct_option;
    const answer = {
        question_id,
        selected_option,
        is_correct: isCorrect
    };

    // Find or create the result entry for the user
    let result = results.find(r => r.quiz_id === quizId && r.user_id === user_id);

    if (!result) {
        result = {
            quiz_id: quizId,
            user_id,
            score: 0,
            answers: []
        };
        results.push(result);
    }

    // Check if the answer was already submitted
    const existingAnswer = result.answers.find(a => a.question_id === question_id);
    if (existingAnswer) {
        return { error: 'Answer already submitted', status: 403 };
    }

    // Add the answer and update the score if correct
    result.answers.push(answer);
    if (isCorrect) {
        result.score++;
    }
    progressData.saveUserScore(quizId, user_id, result.score);

    // Prepare response with feedback
    return {
        isCorrect,
        correct_option: question.correct_option,
        message: isCorrect ? 'Correct!' : 'Incorrect'
    };
};
/**
 * Get a quiz by its ID.
 * @param {number} id - The ID of the quiz.
 * @returns {Object|null} - The quiz object or null if not found.
 */
const getQuizById = (id) => {
    return quizzes.find(q => q.id === id) || null;
};

/**
 * Get the user's results for a specific quiz.
 * @param {number} quizId - The ID of the quiz.
 * @param {string} userId - The ID of the user.
 * @returns {Object|null} - The user's results object or null if not found.
 */
const getUserResults = (quizId, userId) => {
    return results.find(r => r.quiz_id === quizId && r.user_id === userId) || null;
};


module.exports = {
    createQuiz,
    getQuizById,
    submitAnswer,
    getUserResults,
    prepareQuizForClient
};
