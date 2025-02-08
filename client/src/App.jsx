// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Profile from "./components/Profile";
import Question from "./components/Question";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Interview from "./components/Interview";
import VerifyCredentials from "./components/VerifyCredentials";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dashboard = () => (
  <div>
    <h1>Dashboard (Protected)</h1>
    <Question />
    <Logout />
  </div>
);

const App = () => {
  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    if (!browserSupportsSpeechRecognition) {
      return null
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Interview />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/verify" element={<VerifyCredentials />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;