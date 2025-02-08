// src/ResultPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ResultPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch result data from the backend API (localhost)
  useEffect(() => {
    const fetchResult = async () => {
      try {
        // Fetching data from localhost API
        const response = await axios.get("http://localhost:3000/submitAnswer");
        setResult(response.data); // Store the data in state
      } catch (err) {
        setError("Error fetching data from API");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);  // Empty dependency array to only fetch once on component mount

  // Display loading message while fetching
  if (loading) return <div>Loading...</div>;

  // Display error message if there's an issue with the fetch
  if (error) return <div>{error}</div>;

  // Display result data
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-semibold mb-4">Candidate: {result.name}</h2>

      <div className="flex flex-col space-y-4">
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-semibold text-xl">Score: {result.score} </h3>
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-semibold text-xl">Initial Analysis Feedback:</h3>
          <p>{result.initialAnalysisFeedback}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-semibold text-xl">Code Review Feedback:</h3>
          <p>{result.codeReviewFeedback}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-semibold text-xl">AI Generated Answer:</h3>
          <p>{result.aiAnswer}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;