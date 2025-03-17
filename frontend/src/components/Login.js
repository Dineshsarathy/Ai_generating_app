import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider} from "../firebaseConfig"; // Firebase config
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail 
} from "firebase/auth";
import "../styles/Auth.css"; // Shared styles for Login & Signup

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  // 🔹 Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("loggedInUser", userCredential.user.email);
      onLogin();
      navigate("/");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("User does not exist. Please sign up.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Try again.");
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  // 🔹 Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("loggedInUser", result.user.email);
      onLogin();
      navigate("/");
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      alert("Google login failed. Try again.");
    }
  };



  // 🔹 Forgot Password Popup Controls
  const openResetPopup = () => {
    setShowResetPopup(true);
    setResetMessage(""); // Clear any previous message
  };
  const closeResetPopup = () => {
    setShowResetPopup(false);
    setResetEmail(""); // Clear input
  };

  // 🔹 Handle Password Reset
  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setResetMessage("Please enter your email.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Reset link sent! Check your email.");
    } catch (error) {
      setResetMessage("Error: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-form">
          <h2>Welcome back to Login page</h2>
          <p>It's great to have you back!</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" onClick={openResetPopup}>Forgot password?</a>
            </div>
            <button type="submit" className="login-btn">Login</button>
            <p>Don't have an Account? Create an Account Here!</p>
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              Signup
            </button>
            <div className="social-login">
              <p>Or login with</p>
              <button onClick={handleGoogleLogin} className="google">
                Google
              </button>
            </div>
          </form>
        </div>
        <div className="auth-image"></div>
      </div>

      {/* 🔹 Forgot Password Popup */}
      {showResetPopup && (
        <div className="reset-popup">
          <div className="reset-box">
            <h3>Reset Your Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button onClick={handlePasswordReset} className="reset-btn">
              Send Reset Link
            </button>
            <p className="reset-message">{resetMessage}</p>
            <button onClick={closeResetPopup} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
