import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMic,
  FiMicOff,
  FiClock,
  FiSend,
  FiHelpCircle,
  FiAward,
  FiMaximize2,
  FiX,
} from "react-icons/fi";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
// import { FaMicrophone, FaStopCircle } from "react-icons/fa";


const Interview = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("// Write your code here...");
  const [initialAnalysis, setInitialAnalysis] = useState("");
  const [data, setData] = useState([]);
  const [hintLoading, setHintLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800); // Default 30 minutes in seconds
  const [selectedTime, setSelectedTime] = useState(1800);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [fullScreenFeedback, setFullScreenFeedback] = useState(false);
  const [isSpeechOn, setIsSpeechOn] = useState(false);
  const [timerStatus, setTimerStatus] = useState(false);

  // Speech recognition hooks
  const {
    transcript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    resetTranscript,
    listening,
  } = useSpeechRecognition();

  // Fetch questions from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "questions"));
      setData(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  // Update displayed text from speech
  useEffect(() => {
    if (transcript) setInitialAnalysis(transcript);
  }, [transcript]);

  const startTimer = () => {
    setTimerStatus(true);
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }

  // Timer functionality
  // useEffect(() => {
  //   if (timeLeft > 0) {
  //     const timer = setInterval(() => {
  //       setTimeLeft((prev) => prev - 1);
  //     }, 1000);
  //     return () => clearInterval(timer);
  //   }
  // }, [timeLeft]);

  const handleTimeChange = (minutes) => {
    const seconds = minutes * 60;
    setSelectedTime(seconds);
    setTimeLeft(seconds);
    setTimerStatus(false);
  };

  const toggleSpeechRecognition = () => {
    setIsSpeechOn(!isSpeechOn);
    if (!isSpeechOn) {
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    } else {
      SpeechRecognition.stopListening();
    }
  };

  const handleSubmit = async () => {
    const question = data[currentQuestion]?.statement;
    const answerType = "code";

    const requestBody = {
      question: {
        title: data[currentQuestion]?.title,
        statement: question,
        input: data[currentQuestion]?.input,
        output: data[currentQuestion]?.output,
        example_input: data[currentQuestion]?.example_input,
        example_output: data[currentQuestion]?.example_output,
        tags: data[currentQuestion]?.tags,
      },
      answer: code,
      answerType,
      initialAnalysis,
    };

    try {
      setSubmitLoading(true);
      const response = await axios.post(
        "http://localhost:3000/submitAnswer",
        requestBody
      );
      setFeedback(response.data.codeReviewFeedback);
      setScore(response.data.score);
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % data.length);
    setCode("// Write your code here...");
    setInitialAnalysis("");
    setFeedback("");
    setScore(null);
    setShowHint(false);
    setHint("");
    resetTranscript();
    setTimeLeft(selectedTime);
  };

  const handleHint = async () => {
    if (!hint) {
      const requestBody = {
        question: data[currentQuestion],
      };

      try {
        setHintLoading(true);
        const response = await axios.post(
          "http://localhost:3000/doubt",
          requestBody
        );
        setHint(response.data.ideas);
        setShowHint(true);
      } catch (error) {
        console.error("Error fetching hint:", error);
      } finally {
        setHintLoading(false);
      }
    } else {
      setShowHint(!showHint);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-red-500 p-4">
        Browser doesn't support speech recognition.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          { timerStatus ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 bg-indigo-600/30 px-4 py-2 rounded-lg"
          >
            <FiClock className="text-indigo-400" />
            <span className="text-indigo-300 font-medium">
              {formatTime(timeLeft)}
            </span>
          </motion.div>
          ) : (
            <button 
              className="bg-indigo-600/50 hover:bg-indigo-600/70 text-indigo-100 px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all"
            onClick={startTimer}>Start Timer</button>
          ) }

          <select
            value={selectedTime / 60}
            onChange={(e) => handleTimeChange(Number(e.target.value))}
            className="bg-gray-700/50 text-gray-300 px-3 py-2 rounded-lg"
          >
            <option value={5}>5 Minutes</option>
            <option value={15}>15 Minutes</option>
            <option value={30}>30 Minutes</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid lg:grid-cols-2 gap-6 p-6">
        {/* Left Column */}
        <div className="flex flex-col space-y-6">
          {/* Question Card */}
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-gray-800/50 rounded-xl p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-indigo-400">
                Question {currentQuestion + 1}
              </h2>
              <button
                onClick={handleNextQuestion}
                className="bg-blue-600/50 hover:bg-blue-600/70 text-blue-100 px-4 py-2 rounded-lg"
              >
                Next Question
              </button>
            </div>

            {showHint ? (
              <div className="text-gray-300 whitespace-pre-wrap">{hint}</div>
            ) : (
              <p className="text-gray-300 leading-relaxed">
                {data[currentQuestion]?.statement}
              </p>
            )}
          </motion.div>

          {/* Code Editor */}
          <motion.div
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            className="flex-1 rounded-xl overflow-hidden shadow-xl"
          >
            <CodeMirror
              value={code}
              height="100%"
              extensions={[javascript()]}
              onChange={setCode}
              theme="dark"
              className="text-lg"
            />
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col space-y-6">
          {/* Chat Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 rounded-xl p-6 h-96 flex flex-col shadow-xl relative"
          >
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="flex justify-start">
                <div className="bg-gray-700/50 p-4 rounded-2xl max-w-[80%]">
                  <p className="text-gray-300">
                    Welcome! I'm your AI interviewer. Let's discuss your
                    approach.
                  </p>
                </div>
              </div>

              {/* Feedback Section */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-900/20 p-4 rounded-2xl max-w-[80%] relative"
                >
                  <button
                    onClick={() => setFullScreenFeedback(!fullScreenFeedback)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                  >
                    <FiMaximize2 />
                  </button>
                  <h3 className="text-green-400 font-semibold">Feedback</h3>
                  <p className="text-gray-300">{feedback}</p>
                  <p className="text-gray-300 mt-2">
                    <span className="font-semibold">Score:</span> {score}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Initial Analysis */}
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-300 font-medium">Initial Analysis</h3>
                <div className="flex gap-2">
                  {/* {listening ? (
                    <button
                      onClick={SpeechRecognition.stopListening}
                      className="p-2 bg-red-500/50 rounded-lg hover:bg-red-500/70 transition-colors"
                    >
                      <FaStopCircle className="text-red-200" />
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        SpeechRecognition.startListening({ continuous: true })
                      }
                      className="p-2 bg-green-500/50 rounded-lg hover:bg-green-500/70 transition-colors"
                    >
                      <FaMicrophone className="text-green-200" />
                    </button>
                  )} */}

                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={toggleSpeechRecognition}
                      className="flex items-center space-x-2 bg-gray-700/50 px-4 py-2 rounded-lg"
                    >
                      {isSpeechOn ? (
                        <FiMic className="text-green-400" />
                      ) : (
                        <FiMicOff className="text-red-400" />
                      )}
                      <span className="text-gray-300">
                        {isSpeechOn ? "Listening" : "Enable Voice"}
                      </span>
                    </motion.button>
                  </div>
                  <button
                    onClick={() => {
                      resetTranscript();
                      setInitialAnalysis("");
                    }}
                    className="p-2 bg-orange-500/50 rounded-lg hover:bg-orange-500/70 transition-colors"
                  >
                    <span className="text-orange-200">Clear</span>
                  </button>
                </div>
              </div>

              <textarea
                value={initialAnalysis}
                onChange={(e) => setInitialAnalysis(e.target.value)}
                placeholder="Speak or type your initial analysis..."
                className="w-full bg-gray-700/30 text-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-500 transition-all resize-none h-32"
              />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHint}
              disabled={hintLoading}
              className="bg-indigo-600/50 hover:bg-indigo-600/70 text-indigo-100 px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all"
            >
              {hintLoading ? (
                <div className="h-5 w-5 border-2 border-transparent border-t-current rounded-full animate-spin" />
              ) : showHint ? (
                <>
                  <FiHelpCircle className="text-lg" />
                  <span>Show Question</span>
                </>
              ) : (
                <>
                  <FiHelpCircle className="text-lg" />
                  <span>Show Hint</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={submitLoading}
              className="bg-green-600/50 hover:bg-green-600/70 text-green-100 px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all"
            >
              {submitLoading ? (
                <div className="h-5 w-5 border-2 border-transparent border-t-current rounded-full animate-spin" />
              ) : (
                <>
                  <FiSend className="text-lg" />
                  <span>Submit Solution</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/rewards")}
              className="bg-purple-600/50 hover:bg-purple-600/70 text-purple-100 px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all"
            >
              <FiAward className="text-lg" />
              <span>Rewards</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Full Screen Feedback */}
      <AnimatePresence>
        {fullScreenFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 p-8 flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setFullScreenFeedback(false)}
              className="absolute top-4 right-4 text-2xl text-white"
            >
              <FiX />
            </button>
            <h2 className="text-3xl font-bold text-green-400 mb-4">Feedback</h2>
            <div className="text-xl text-gray-300 max-w-4xl w-full">
              {feedback}
            </div>
            <div className="text-2xl text-white mt-8">Score: {score}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Interview;
