import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./Auth.css";

const AuthContainer = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState("login");

  const handleRegisterSuccess = (user) => {
    // When registration is successful, automatically log the user in
    onLogin(user);
  };

  return (
    <div className="auth-outer-container">
      <div className="auth-mode-toggle">
        <button
          className={`auth-toggle-btn ${authMode === "login" ? "active" : ""}`}
          onClick={() => setAuthMode("login")}
        >
          Login
        </button>
        <button
          className={`auth-toggle-btn ${
            authMode === "register" ? "active" : ""
          }`}
          onClick={() => setAuthMode("register")}
        >
          Create Admin
        </button>
      </div>

      {authMode === "login" ? (
        <Login onLogin={onLogin} />
      ) : (
        <Register onRegisterSuccess={handleRegisterSuccess} />
      )}
    </div>
  );
};

export default AuthContainer;
