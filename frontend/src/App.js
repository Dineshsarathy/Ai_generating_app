import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ImageGenerator from "./components/ImageGenerator";
import TextGenerator from "./components/TextGenerator";
import ContentGenerator from "./components/ContentGenerator";
import VideoGenerator from "./components/VideoGenerator";
import HistoryPanel from "./components/HistoryPanel";
import "./App.css"; // Ensure styles are applied

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load authentication status from localStorage on app load
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(storedAuth);
  }, []);

  // Handle login
  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup onSignup={handleLogin} />} />
        <Route path="/" element={isAuthenticated ? <MainApp onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

const MainApp = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("text");
  const [showLogout, setShowLogout] = useState(false);
  const [history, setHistory] = useState({
    text: [],
    image: [],
    video: [],
    content: [],
  });
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Save generated content in history
  const addToHistory = (type, item) => {
    setHistory((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), item], // Ensure prev[type] is always an array
    }));
  };
  

  // Switch tabs
  const switchTab = (tab) => {
    setActiveTab(tab);
    setSelectedHistoryItem(null); // Reset selected history on tab switch
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Gen-AI</h1>
        <nav className="nav-bar">
          <button className={activeTab === "text" ? "active" : ""} onClick={() => switchTab("text")}>Text Generate</button>
          <button className={activeTab === "image" ? "active" : ""} onClick={() => switchTab("image")}>Image Generate</button>
          <button className={activeTab === "video" ? "active" : ""} onClick={() => switchTab("video")}>Video Generate</button>
          <button className={activeTab === "content" ? "active" : ""} onClick={() => switchTab("content")}>Content Generate</button>

          {/* Profile Section */}
          <div className="profile-section">
            <button onClick={() => setShowLogout(!showLogout)} className="profile-button">
              Profile ⬇
            </button>
            {showLogout && (
              <div className="dropdown-menu">
                <button onClick={onLogout} className="logout-button">Logout</button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <div className="main-content">
        {/* Left Side - History Panel */}
        <HistoryPanel history={history[activeTab]} onSelect={setSelectedHistoryItem} />

        {/* Right Side - AI Generators */}
        <section className="generator-section">
          {activeTab === "text" && <TextGenerator addToHistory={addToHistory} selectedHistoryItem={selectedHistoryItem} />}
          {activeTab === "image" && <ImageGenerator addToHistory={addToHistory} selectedHistoryItem={selectedHistoryItem} />}
          {activeTab === "video" && <VideoGenerator addToHistory={addToHistory} selectedHistoryItem={selectedHistoryItem} />}
          {activeTab === "content" && <ContentGenerator addToHistory={addToHistory} selectedHistoryItem={selectedHistoryItem} />}
        </section>
      </div>
    </div>
  );
};

export default App;
