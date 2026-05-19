const express = require('express');
const { getDb } = require('../lib/mongo');

const router = express.Router();

// POST /api/feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const db = await getDb();
    const feedbacks = db.collection('feedbacks');
    
    await feedbacks.insertOne({
      name,
      email,
      message,
      submittedAt: new Date()
    });

    res.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('[Feedback Route Error]', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

module.exports = router;
