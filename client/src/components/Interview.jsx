import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const Interview = () => {
  const [code, setCode] = useState("// Write your code here...");
  const [isSpeechOn, setIsSpeechOn] = useState(false);
  const [chatInput, setChatInput] = useState("");

  const [data, setData] = useState([]);
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

  return (
    <div className="h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Timer */}
      <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-md text-lg">
        Timer
      </div>

      {/* Speech Recognition Toggle */}
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
          <div
            className="bg-red-400 p-6 rounded-md text-white text-xl text-center"
            statement
          >
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
              <h1 className="text-2xl font-semibold text-center mb-2">
                {data[rand]?.id}
              </h1>

              <p className="mt-4 text-gray-700 leading-relaxed">
                {data[rand]?.statement}
              </p>
            </div>
          </div>
          <div className="bg-red-400 p-4 rounded-md">
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
          <div className="bg-red-400 p-6 rounded-md text-white text-xl text-center h-[calc(100%-245px)]">
            Chatbox with AI
          </div>

          {/* New Chat Input Box */}
          <div className="bg-red-400 p-4 rounded-md">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 rounded-md text-gray-700 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;