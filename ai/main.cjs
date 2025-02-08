const express = require('express');
const cors = require('cors');
const { generateResponse } = require('./aiService.cjs'); // Module for GPT API calls
const app = express();

app.use(cors()); // Enable CORS
app.use(express.json());

// Mock function to simulate fetching a question from a database
async function getQuestionFromFirewallDB() {
  // Replace this with your actual database fetching logic
  return {
    title: "Domino Piling",
    statement: "You are given a rectangular board of M × N squares. Also you are given an unlimited number of standard domino pieces of 2 × 1 squares. You are allowed to rotate the pieces. You are asked to place as many dominoes as possible on the board so as to meet the following conditions: 1. Each domino completely covers two squares. 2. No two dominoes overlap. 3. Each domino lies entirely inside the board. It is allowed to touch the edges of the board. Find the maximum number of dominoes, which can be placed under these restrictions.",
    input: "In a single line you are given two integers M and N — board sizes in squares (1 ≤ M ≤ N ≤ 16).",
    output: "Output one number — the maximal number of dominoes, which can be placed.",
    example_input: "2 4",
    example_output: "4",
    tags: ["greedy", "math"]
  };
}

// Endpoint to get a question
app.get('/getQuestion', async (req, res) => {
  try {
    const question = await getQuestionFromFirewallDB();
    res.json({ question });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to submit an answer
app.post('/submitAnswer', async (req, res) => {
  const { question, answer, answerType, initialAnalysis } = req.body; // answerType can be 'code' or 'oral'
  
  // Construct appropriate prompts
  const initialAnalysisPrompt = `Review the following initial analysis for correctness and depth based on the question:\n\nQuestion: ${question.title}\n\n${question.statement}\n\nInitial Analysis:\n${initialAnalysis}`;
  let codeReviewPrompt;
  if (answerType === 'code') {
    codeReviewPrompt = `Review the following code snippet for correctness and best practices based on the question:\n\nQuestion: ${question.title}\n\n${question.statement}\n\nCode:\n${answer}`;
  } else {
    codeReviewPrompt = `Answer the following question based on the provided parameters:\n\nQuestion: ${question.title}\n\n${question.statement}\n\nAnswer:\n${answer}`;
  }
  const aiAnswerPrompt = `Provide a good answer to the following question:\n\nQuestion: ${question.title}\n\n${question.statement}`;

  try {
    const initialAnalysisResponse = await generateResponse(initialAnalysisPrompt);
    const codeReviewResponse = await generateResponse(codeReviewPrompt);
    const aiAnswerResponse = await generateResponse(aiAnswerPrompt);

    // Calculate marks out of 10 based on the responses
    const initialAnalysisScore = Math.floor(Math.random() * 6) + 5; // Random score between 5 and 10
    const codeReviewScore = Math.floor(Math.random() * 6) + 5; // Random score between 5 and 10
    const totalScore = (initialAnalysisScore + codeReviewScore) / 2;

    res.json({
      initialAnalysisFeedback: initialAnalysisResponse,
      codeReviewFeedback: codeReviewResponse,
      aiAnswer: aiAnswerResponse,
      score: totalScore
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to provide ideas or hints about the question
app.post('/doubt', async (req, res) => {
  const { question } = req.body;

  // Construct the prompt for providing ideas or hints
  const doubtPrompt = `Provide some ideas or hints to help solve the following question:\n\nQuestion: ${question.title}\n\n${question.statement}`;

  try {
    const doubtResponse = await generateResponse(doubtPrompt);
    res.json({ ideas: doubtResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server is running on port 3000'));
