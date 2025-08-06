const express = require('express');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const auth = require('../middleware/auth');
const router = express.Router();

function generateId(prefix) {
  return prefix + Math.floor(1000 + Math.random() * 9000);
}

// Create a new question
router.post('/questions', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { title, description, tags } = req.body;

    const questionId = generateId('Q');
    const question = new Question({
      questionId,
      title,
      description,
      tags: tags || [],
      createdAt: new Date(),
      askedBy: {
        userId,
        name: req.user.name,
        email: req.user.email
      }
      // Optional fields will use defaults: views: 0, votes: 0, answers: 0, status: 'Open'
    });

    await question.save();
    res.status(201).json({ 
      message: 'Question created successfully',
      question 
    });
  } catch (err) {
    console.error('Error creating question:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all questions with filtering and pagination
router.get('/questions', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      tags, 
      status, 
      sort = 'newest' 
    } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    if (status) {
      query.status = status;
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'most_answers':
        sortObj = { answers: -1 };
        break;
      case 'most_views':
        sortObj = { views: -1 };
        break;
      case 'most_votes':
        sortObj = { votes: -1 };
        break;
      case 'unanswered':
        query.answers = 0;
        sortObj = { createdAt: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const questions = await Question.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const totalQuestions = await Question.countDocuments(query);

    // Transform questions to ensure all fields are present
    const transformedQuestions = questions.map(question => ({
      ...question.toObject(),
      views: question.views || 0,
      votes: question.votes || 0,
      answers: question.answers || 0,
      status: question.status || 'Open'
    }));

    res.json({
      questions: transformedQuestions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalQuestions / limit),
        totalItems: totalQuestions,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single question by ID (supports both ObjectId and questionId)
router.get('/questions/:id', async (req, res) => {
  try {
    let question;
    
    // Check if the ID is a valid ObjectId (24 character hex string)
    if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      question = await Question.findById(req.params.id);
    } else {
      // If not ObjectId, treat as questionId
      question = await Question.findOne({ questionId: req.params.id });
    }
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Increment view count if the field exists
    if (question.views !== undefined) {
      question.views += 1;
      await question.save();
    }

    // Transform question to ensure all fields are present
    const transformedQuestion = {
      ...question.toObject(),
      views: question.views || 0,
      votes: question.votes || 0,
      answers: question.answers || 0,
      status: question.status || 'Open'
    };

    res.json({ question: transformedQuestion });
  } catch (err) {
    console.error('Error fetching question:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's questions
router.get('/my-questions', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const questions = await Question.find({ 'askedBy.userId': userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalQuestions = await Question.countDocuments({ 'askedBy.userId': userId });

    res.json({
      questions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalQuestions / limit),
        totalItems: totalQuestions,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Error fetching user questions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update question
router.put('/questions/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { title, description, tags } = req.body;

    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user owns the question
    if (question.askedBy.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this question' });
    }

    question.title = title;
    question.description = description;
    question.tags = tags || [];
    question.updatedAt = new Date();

    await question.save();
    res.json({ message: 'Question updated successfully', question });
  } catch (err) {
    console.error('Error updating question:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete question
router.delete('/questions/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user owns the question
    if (question.askedBy.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }

    // Delete associated answers
    await Answer.deleteMany({ questionId: question.questionId });
    
    // Delete the question
    await Question.findByIdAndDelete(req.params.id);

    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Vote on question
router.post('/questions/:id/vote', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { voteType } = req.body; // 'up' or 'down'

    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user already voted
    const existingVote = question.userVotes?.find(vote => vote.userId === userId);
    
    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote if same type clicked again
        question.userVotes = question.userVotes.filter(vote => vote.userId !== userId);
        question.votes -= (voteType === 'up' ? 1 : -1);
      } else {
        // Change vote
        existingVote.voteType = voteType;
        question.votes += (voteType === 'up' ? 2 : -2);
      }
    } else {
      // Add new vote
      if (!question.userVotes) question.userVotes = [];
      question.userVotes.push({ userId, voteType });
      question.votes += (voteType === 'up' ? 1 : -1);
    }

    await question.save();
    res.json({ message: 'Vote recorded', votes: question.votes });
  } catch (err) {
    console.error('Error voting on question:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create an answer
router.post('/questions/:id/answers', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { answerText } = req.body;

    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answerId = generateId('A');
    const answer = new Answer({
      answerId,
      questionId: question.questionId,
      questionObjectId: question._id, // Store the question's ObjectId
      answerText,
      votes: 0,
      createdAt: new Date(),
      answeredBy: {
        userId,
        name: req.user.name,
        email: req.user.email
      }
      // Optional fields will use defaults: isAccepted: false
    });

    await answer.save();

    // Update question answer count if the field exists
    if (question.answers !== undefined) {
      question.answers += 1;
      if (question.answers > 0 && question.status !== undefined) {
        question.status = 'Answered';
      }
      await question.save();
    }

    res.status(201).json({ 
      message: 'Answer posted successfully',
      answer 
    });
  } catch (err) {
    console.error('Error creating answer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get answers for a question
router.get('/questions/:id/answers', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answers = await Answer.find({ questionId: question.questionId })
      .sort({ votes: -1, createdAt: 1 });

    // Transform answers to ensure all fields are present
    const transformedAnswers = answers.map(answer => ({
      ...answer.toObject(),
      votes: answer.votes || 0,
      isAccepted: answer.isAccepted || false
    }));

    res.json({ answers: transformedAnswers });
  } catch (err) {
    console.error('Error fetching answers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's answers
router.get('/my-answers', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const answers = await Answer.find({ 'answeredBy.userId': userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // For each answer, get the question's ObjectId if questionObjectId doesn't exist
    const answersWithQuestionIds = await Promise.all(
      answers.map(async (answer) => {
        const answerObj = answer.toObject();
        
        // If questionObjectId doesn't exist, find the question and get its ObjectId
        if (!answerObj.questionObjectId) {
          try {
            const question = await Question.findOne({ questionId: answerObj.questionId });
            if (question) {
              answerObj.questionObjectId = question._id;
            }
          } catch (err) {
            console.error('Error finding question for answer:', err);
          }
        }
        
        return answerObj;
      })
    );

    const totalAnswers = await Answer.countDocuments({ 'answeredBy.userId': userId });

    res.json({
      answers: answersWithQuestionIds,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalAnswers / limit),
        totalItems: totalAnswers,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Error fetching user answers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update answer
router.put('/answers/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { answerText } = req.body;

    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user owns the answer
    if (answer.answeredBy.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this answer' });
    }

    answer.answerText = answerText;
    answer.updatedAt = new Date();

    await answer.save();
    res.json({ message: 'Answer updated successfully', answer });
  } catch (err) {
    console.error('Error updating answer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete answer
router.delete('/answers/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user owns the answer
    if (answer.answeredBy.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this answer' });
    }

    // Update question answer count
    const question = await Question.findOne({ questionId: answer.questionId });
    if (question) {
      question.answers = Math.max(0, question.answers - 1);
      if (question.answers === 0) {
        question.status = 'Open';
      }
      await question.save();
    }

    await Answer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Answer deleted successfully' });
  } catch (err) {
    console.error('Error deleting answer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Vote on answer
router.post('/answers/:id/vote', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { voteType } = req.body; // 'up' or 'down'

    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user already voted
    const existingVote = answer.userVotes?.find(vote => vote.userId === userId);
    
    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote if same type clicked again
        answer.userVotes = answer.userVotes.filter(vote => vote.userId !== userId);
        answer.votes -= (voteType === 'up' ? 1 : -1);
      } else {
        // Change vote
        existingVote.voteType = voteType;
        answer.votes += (voteType === 'up' ? 2 : -2);
      }
    } else {
      // Add new vote
      if (!answer.userVotes) answer.userVotes = [];
      answer.userVotes.push({ userId, voteType });
      answer.votes += (voteType === 'up' ? 1 : -1);
    }

    await answer.save();
    res.json({ message: 'Vote recorded', votes: answer.votes });
  } catch (err) {
    console.error('Error voting on answer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark answer as accepted
router.post('/answers/:id/accept', auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const question = await Question.findOne({ questionId: answer.questionId });
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user owns the question
    if (question.askedBy.userId !== userId) {
      return res.status(403).json({ message: 'Only the question author can accept answers' });
    }

    // Unaccept any previously accepted answer
    await Answer.updateMany(
      { questionId: answer.questionId },
      { isAccepted: false }
    );

    // Accept this answer
    answer.isAccepted = true;
    await answer.save();

    // Update question status
    question.status = 'Answered';
    await question.save();

    res.json({ message: 'Answer accepted successfully', answer });
  } catch (err) {
    console.error('Error accepting answer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 