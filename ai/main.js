const express = require('express');
const bodyParser = require('body-parser');
const { generateResponse } = require('./aiService'); // Module for GPT API calls
const app = express();
app.use(bodyParser.json());

// Endpoint to get a question
app.get('/getQuestion', async (req, res) => {
  // Replace with your logic to fetch from your firewall database
  const question = await getQuestionFromFirewallDB();
  res.json({ question });
});

// Endpoint to submit an answer
app.post('/submitAnswer', async (req, res) => {
  const { questionId, answer, answerType } = req.body; // answerType can be 'code' or 'oral'
  
  // Construct appropriate prompt
  let prompt;
  if (answerType === 'code') {
    prompt = `Review the following code snippet for correctness and best practices:\n\n${answer}`;
  } else {
    prompt = `Evaluate the following answer for clarity and correctness:\n\n${answer}`;
  }
  
  try {
    const feedback = await generateResponse(prompt);
    res.json({ feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
