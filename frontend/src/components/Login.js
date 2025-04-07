import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebaseConfig";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import "../styles/Auth.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("loggedInUser", userCredential.user.email);
      onLogin();
      navigate("/");
    } catch (err) {
      setLoading(false);
      switch (err.code) {
        case "auth/user-not-found":
          setError("User not found. Please sign up.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        default:
          setError("Login failed. Please try again later.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("loggedInUser", result.user.email);
      onLogin();
      navigate("/");
    } catch (err) {
      setError("Google login failed. Please try again.");
    }
  };

  // Add this missing function
  const openResetPopup = () => {
    setShowResetPopup(true);
    setResetMessage("");
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setResetMessage("Please enter your email address.");
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Password reset link sent to your email!");
      setTimeout(() => {
        setShowResetPopup(false);
        setResetEmail("");
        setResetMessage("");
      }, 3000);
    } catch (err) {
      setResetMessage("Error sending reset email. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-form">
          <h2>Welcome Back</h2>
          <p>Please login to continue</p>
          
          {error && <p className="error-message">{error}</p>}
          
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
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <span className="link" onClick={openResetPopup}>Forgot password?</span>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            
            <div className="social-login">
              <p>Or login with</p>
              <button type="button" className="btn google-btn" onClick={handleGoogleLogin}>
                <FaGoogle /> Continue with Google
              </button>
            </div>
            
            <p className="text-center">
              Don't have an account?{" "}
              <span className="link" onClick={() => navigate("/signup")}>Sign up</span>
            </p>
          </form>
        </div>
        
        <div className="auth-image">
          <img src={require("../assets/login2.jpeg")} alt="Login visual" />
        </div>
      </div>
      
      {showResetPopup && (
        <div className="reset-popup">
          <div className="reset-box">
            <h3>Reset Password</h3>
            <input
              type="email"
              placeholder="Your email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              style={{
                width: '90%',       // Adjust width as needed
                maxWidth: '400px',   // Limit max-width to make it responsive
                height: '8px',      // Adjust height
                fontSize: '1.2rem',  // Adjust font size
                padding: '10px',     // Adjust padding inside the input box
                borderRadius: '8px', // Optional: add rounded corners
              }}
            />
            <button className="btn btn-secondary" onClick={handlePasswordReset}>
              Send Reset Link
            </button>
            {resetMessage && <p className="reset-message">{resetMessage}</p>}
            <button 
              className="btn" 
              onClick={() => {
                setShowResetPopup(false);
                setResetEmail("");
                setResetMessage("");
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;