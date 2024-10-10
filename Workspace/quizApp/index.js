const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use('/api/v1',require('../quizApp/router/index'))

// Run the server
app.listen(PORT, () => {
    console.log(`Quiz App running at http://localhost:${PORT}`);
});
