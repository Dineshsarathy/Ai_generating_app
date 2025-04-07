import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "../styles/Auth.css";

const Signup = ({ onSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSignup();
      navigate("/");
    } catch (err) {
      setLoading(false);
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email already in use. Please login.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        default:
          setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-form">
          <h2>Create Account</h2>
          <p>Join us to get started</p>
          
          {error && <p className="error-message">{error}</p>}
          
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
            
            <p className="text-center">
              Already have an account?{" "}
              <span className="link" onClick={() => navigate("/login")}>Login</span>
            </p>
          </form>
        </div>
        
        <div className="auth-image">
          <img src={require("../assets/signup.jpeg")} alt="Signup visual" />
        </div>
      </div>
    </div>
  );
};

export default Signup;