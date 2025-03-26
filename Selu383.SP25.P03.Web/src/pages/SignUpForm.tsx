import React, { useState } from "react";
import { UserDto } from "../models/UserDto"; 
import "../styles/Login.css"; 

interface SignUpFormProps {
  onSignUpSuccess: (user: UserDto) => void;
  onSwitchToLogin: () => void; 
}

export function SignUpForm({ onSignUpSuccess, onSwitchToLogin }: SignUpFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2 className="login-title">Sign Up</h2>
        <form className="login-form" onSubmit={(e) => signUp(e)}>
          <div className="input-group">
            <label htmlFor="username" className="input-label">Username:</label>
            <input
              type="text"
              id="username"
              className="login-input"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email:</label>
            <input
              type="email"
              id="email"
              className="login-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">Password:</label>
            <input
              type="password"
              id="password"
              className="login-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {formError ? <p className="error-message">{formError}</p> : null}
          <div className="button-container">
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
          <p className="switch-text">
            Already have an account? <span onClick={onSwitchToLogin} className="switch-link">Log in</span>
          </p>
        </form>
      </div>
    </div>
  );

  function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setFormError("");
    setLoading(true);

    fetch("/api/authentication/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Signup failed");
        return response.json();
      })
      .then((data: UserDto) => onSignUpSuccess(data))
      .catch(() => {
        setFormError("Signup failed. Try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }
}
