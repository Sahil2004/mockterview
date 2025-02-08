import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const getRandomInt = (max) => Math.floor(Math.random() * max);

const Interview = () => {
  const [code, setCode] = useState("// Write your code here...");
  const [isSpeechOn, setIsSpeechOn] = useState(false);
  const [initialAnalysis, setInitialAnalysis] = useState("");
  const [data, setData] = useState([]);
  const [hintLoading, setHintLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const rand = getRandomInt(2);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "questions"));
      setData(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const toggleSpeechRecognition = () => {
    setIsSpeechOn(!isSpeechOn);
    alert(isSpeechOn ? "Speech Recognition Off" : "Speech Recognition On");
  };

  const handleSubmit = async () => {
    console.log("Submit button clicked");
    const question = data[rand]?.statement;
    const answerType = "code"; // Assuming the answer type is code

    const requestBody = {
      question: {
        title: data[rand]?.title,
        statement: question,
        input: data[rand]?.input,
        output: data[rand]?.output,
        example_input: data[rand]?.example_input,
        example_output: data[rand]?.example_output,
        tags: data[rand]?.tags,
      },
      answer: code,
      answerType,
      initialAnalysis,
    };

    console.log("Request Body:", requestBody);

    try {
      setSubmitLoading(true);
      const response = await axios.post(
        "http://localhost:3000/submitAnswer",
        requestBody
      );
      localStorage.setItem("score", response.data.score);
      localStorage.setItem("feedback", response.data.codeReviewFeedback);
      console.log("Feedback Report:", response.data);
      setSubmitLoading(false);
      if(!alert(`Feedback Report:\n\nInitial Analysis Feedback: ${response.data.initialAnalysisFeedback}\n\nCode Review Feedback: ${response.data.codeReviewFeedback}\n\nAI Answer: ${response.data.aiAnswer}\n\nScore: ${response.data.score}`)) {
        (() => {
          const navigate = useNavigate();
          navigate("/rewards");
        })()
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setSubmitLoading(false);
    }
  };

  const handleHint = async () => {
    const question = data[rand]?.statement;

    const requestBody = {
      question: {
        title: data[rand]?.title,
        statement: question,
        input: data[rand]?.input,
        output: data[rand]?.output,
        example_input: data[rand]?.example_input,
        example_output: data[rand]?.example_output,
        tags: data[rand]?.tags,
      },
    };

    try {
      setHintLoading(true);
      const response = await axios.post(
        "http://localhost:3000/doubt",
        requestBody
      );
      alert(`Hint: ${response.data.ideas}`);
      setHintLoading(false);
    } catch (error) {
      console.error("Error fetching hint:", error);
      setHintLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Timer */}
      <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-md text-lg">
        Timer
      </div>

      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <span className="text-gray-600">Speech recognition</span>
        <button
          onClick={toggleSpeechRecognition}
          className={`w-6 h-6 rounded-full ${
            isSpeechOn ? "bg-green-500" : "bg-gray-300"
          }`}
        />
      </div>

      {/* Main Layout */}
      <div className="w-3/4 grid grid-cols-2 gap-4">
        {/* Left Side: Question + Coding Window */}
        <div className="col-span-1 flex flex-col space-y-4">
          <div className="p-6 rounded-md text-white text-xl text-center">
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
              <h1 className="text-2xl font-semibold text-center mb-2">
                {data[rand]?.id}
              </h1>

              <p className="mt-4 text-gray-700 leading-relaxed">
                {data[rand]?.statement}
              </p>
            </div>
          </div>
          <div className="p-4 rounded-md">
            <CodeMirror
              value={code}
              height="200px"
              extensions={[javascript()]}
              onChange={(value) => setCode(value)}
              className="text-white"
            />
          </div>
        </div>

        {/* Right Side: Chatbox */}
        <div className="col-span-1 flex flex-col space-y-4">
          <div className=" shadow-md p-6 rounded-md bg-white text-xl text-center h-[calc(100%-245px)]">
            Chatbox with AI
          </div>

          <div>
            <h2>Initial Analysis</h2>
            <textarea
              value={initialAnalysis}
              onChange={(e) => setInitialAnalysis(e.target.value)}
              placeholder="Write your initial analysis here"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleHint}
              className="p-2 bg-blue-500 m-1 text-white rounded-md"
            >
              {hintLoading ? (
                <div role="status">
                <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
              ) : (
                <p>Hint</p>
              )}
            </button>
          </div>

          <button
            className="p-2 bg-blue-500 text-white rounded-md"
            onClick={handleSubmit}
          >
              {submitLoading ? (
                <div role="status">
                <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
              ) : (
                <p>Submit</p>
              )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Interview;
