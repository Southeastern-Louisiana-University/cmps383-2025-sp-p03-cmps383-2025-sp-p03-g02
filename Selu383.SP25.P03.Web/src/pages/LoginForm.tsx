import React, { useState } from "react";
import { UserDto } from "../models/UserDto"; 
import "../styles/Login.css"; 

interface LoginFormProps {
  onLoginSuccess: (user: UserDto) => void;
  onSwitchToSignUp: () => void;
}

export function LoginForm({ onLoginSuccess, onSwitchToSignUp }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={(e) => login(e)}>
          <div className="input-group">
            <label htmlFor="username" className="input-label">Username:</label>
            <input
              type="text"
              name="username"
              id="username"
              className="login-input"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">Password:</label>
            <input
              type="password"
              name="password"
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <p className="switch-text">
            Don't have an account? <span onClick={onSwitchToSignUp} className="switch-link">Sign up</span>
          </p>
        </form>
      </div>
    </div>
  );

  function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setFormError("");
    setLoading(true);
    
    fetch("/api/authentication/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data: UserDto) => onLoginSuccess(data))
      .catch(() => {
        setFormError("Wrong username or password");
      })
      .finally(() => {
        setLoading(false);
      });
  }
}
