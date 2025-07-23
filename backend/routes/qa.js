const express = require('express');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const auth = require('../middleware/auth');
const router = express.Router();

function generateId(prefix) {
  return prefix + Math.floor(1000 + Math.random() * 9000);
}

router.post('/question', auth, async (req, res) => {
  const { title, description, tags, askedBy } = req.body;
  try {
    const questionId = generateId('Q');
    const question = new Question({
      questionId,
      title,
      description,
      tags,
      createdAt: new Date(),
      askedBy
    });
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Post an answer
router.post('/answer/:questionId', auth, async (req, res) => {
  const { answerText, answeredBy } = req.body;
  try {
    const answerId = generateId('A');
    const answer = new Answer({
      answerId,
      questionId: req.params.questionId,
      answerText,
      votes: 0,
      createdAt: new Date(),
      answeredBy
    });
    await answer.save();
    res.json(answer);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get answers for a question
router.get('/answers/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ questionId: req.params.questionId });
    res.json(answers);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router; 