import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserDto } from "./models/UserDto";
import Navbar from "./components/Navbar";
import AppRoutes from "./AppRoutes";
import LoadingSpinner from "./components/LoadingSpinner"; 
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState<UserDto | undefined>(undefined);
  const [showSignUp, setShowSignUp] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch("/api/authentication/me");
        if (response.ok) {
          const user: UserDto = await response.json();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      } finally {
        setLoading(false); 
      }
    }

    fetchCurrentUser();
  }, []);

  return (
    <Router>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <AppRoutes
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            showSignUp={showSignUp}
            setShowSignUp={setShowSignUp}
          />
        </>
      )}
    </Router>
  );
}

export default App;
