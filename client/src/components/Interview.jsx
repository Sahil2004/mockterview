import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import axios from "axios";

const getRandomInt = (max) => Math.floor(Math.random() * max);

const Interview = () => {
  const [code, setCode] = useState("// Write your code here...");
  const [isSpeechOn, setIsSpeechOn] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [initialAnalysis, setInitialAnalysis] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [data, setData] = useState([]);
  const [doubt, setDoubt] = useState("hidden");
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
    const question = data[rand]?.statement;
    const answerType = "code";

    const requestBody = {
      question: { ...data[rand] },
      answer: code,
      answerType,
      initialAnalysis: chatInput,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/submitAnswer",
        requestBody
      );
      setFeedback(response.data);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="absolute top-4 left-4 text-lg font-medium">Timer</div>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="text-gray-600">Speech Recognition</span>
        <button
          onClick={toggleSpeechRecognition}
          className={`w-6 h-6 rounded-full ${
            isSpeechOn ? "bg-green-500" : "bg-gray-300"
          }`}
        />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-4">
          <div className="p-6 bg-white shadow rounded-lg">
            <h1 className="text-xl font-semibold">{data[rand]?.id}</h1>
            <p className="mt-2 text-gray-700">{data[rand]?.statement}</p>
          </div>

          <div className="p-4 bg-white shadow rounded-lg">
            <CodeMirror
              value={code}
              height="200px"
              extensions={[javascript()]}
              onChange={(value) => setCode(value)}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">Chatbox with AI</h2>
          </div>

          <textarea
            className="w-full p-2 border rounded-md text-gray-700"
            value={initialAnalysis}
            onChange={(e) => setInitialAnalysis(e.target.value)}
            placeholder="Write your initial analysis here"
          />

          <div className="flex justify-center">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 border m-1 rounded-md text-gray-700"
              class={doubt}
            />
            <button onClick={() => doubt == "hidden" ? setDoubt("") : setDoubt("hidden")} className="p-2 bg-blue-500 m-1 text-white rounded-md">Ask doubt</button>
          </div>

          <button
            className="p-2 bg-blue-500 text-white rounded-md"
            onClick={handleSubmit}
          >
            Submit
          </button>

          {feedback && (
            <div className="p-4 bg-white shadow rounded-lg">
              <h2 className="text-lg font-semibold">Feedback</h2>
              <p>
                <strong>Initial Analysis Feedback:</strong>{" "}
                {feedback.initialAnalysisFeedback}
              </p>
              <p>
                <strong>Code Review Feedback:</strong>{" "}
                {feedback.codeReviewFeedback}
              </p>
              <p>
                <strong>AI Answer:</strong> {feedback.aiAnswer}
              </p>
              <p>
                <strong>Score:</strong> {feedback.score}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;
