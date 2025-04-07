import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ImageGenerator from "./components/ImageGenerator";
import TextGenerator from "./components/TextGenerator";
import ContentGenerator from "./components/ContentGenerator";
import VideoGenerator from "./components/VideoGenerator";
import HistoryPanel from "./components/HistoryPanel";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(storedAuth);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <Router>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} darkMode={darkMode} />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup onSignup={handleLogin} darkMode={darkMode} />} />
          <Route path="/" element={
            isAuthenticated ? 
              <MainApp 
                onLogout={handleLogout} 
                darkMode={darkMode} 
                toggleDarkMode={toggleDarkMode} 
              /> : 
              <Navigate to="/login" />
          } />
        </Routes>
      </Router>
    </div>
  );
};

const MainApp = ({ onLogout, darkMode, toggleDarkMode }) => {
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

  const addToHistory = (type, item) => {
    setHistory((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), item],
    }));
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSelectedHistoryItem(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Generative-AI</h1>
        <nav className="nav-bar">
          <button className={activeTab === "text" ? "active" : ""} onClick={() => switchTab("text")}>
            Text Generate
          </button>
          <button className={activeTab === "image" ? "active" : ""} onClick={() => switchTab("image")}>
            Image Generate
          </button>
          <button className={activeTab === "video" ? "active" : ""} onClick={() => switchTab("video")}>
            Video Generate
          </button>
          <button className={activeTab === "content" ? "active" : ""} onClick={() => switchTab("content")}>
            Content Generate
          </button>

          <div className="theme-toggle-container">
            <button onClick={toggleDarkMode} className="theme-toggle-btn">
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          <div className="profile-section">
            <button onClick={() => setShowLogout(!showLogout)} className="profile-button">
              User Profile ⬇
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
        <HistoryPanel history={history[activeTab]} onSelect={setSelectedHistoryItem} darkMode={darkMode} />
        <section className="generator-section">
          {activeTab === "text" && <TextGenerator addToHistory={addToHistory} selectedHistoryItem={selectedHistoryItem} darkMode={darkMode} />}
          {activeTab === "image" && <ImageGenerator addToHistory={addToHistory} selectedHistoryItem={selectedHistoryItem} darkMode={darkMode} />}
          {activeTab === "video" && <VideoGenerator addToHistory={addToHistory} selectedHistoryItem={selectedHistoryItem} darkMode={darkMode} />}
          {activeTab === "content" && <ContentGenerator addToHistory={addToHistory} selectedHistoryItem={selectedHistoryItem} darkMode={darkMode} />}
        </section>
      </div>
    </div>
  );
};

export default App;