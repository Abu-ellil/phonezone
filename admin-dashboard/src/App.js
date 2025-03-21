import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "./App.css";
import AuthContainer from "./components/Auth/AuthContainer";
import Dashboard from "./components/Dashboard/Dashboard";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase
initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="App">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <AuthContainer onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
