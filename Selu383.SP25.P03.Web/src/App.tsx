import { useState } from "react";
import { LoginForm } from "./pages/LoginForm";
import { SignUpForm } from "./pages/SignUpForm";
import { UserDto } from "./models/UserDto";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./AppRoutes";

function App() {
  const [currentUser, setCurrentUser] = useState<UserDto | undefined>(undefined);
  const [showSignUp, setShowSignUp] = useState(false); // Controls the switch

  return (
    <>
      {!currentUser ? (
        showSignUp ? (
          <SignUpForm
            onSignUpSuccess={(user) => setCurrentUser(user)}
            onSwitchToLogin={() => setShowSignUp(false)} // Switch back to login
          />
        ) : (
          <LoginForm
            onLoginSuccess={(user) => setCurrentUser(user)}
            onSwitchToSignUp={() => setShowSignUp(true)} // This must be here!
          />
        )
      ) : (
        <Router>
          <Navbar />
          <AppRoutes />
        </Router>
      )}
    </>
  );
}

export default App;
