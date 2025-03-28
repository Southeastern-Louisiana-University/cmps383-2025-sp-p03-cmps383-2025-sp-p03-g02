import { Routes, Route, Navigate } from "react-router-dom";
import Movies from "./pages/Movies";
import Theaters from "./pages/Theaters";
import Tickets from "./pages/Tickets";
import Food from "./pages/Food";
import Account from "./pages/Account";
import Management from "./pages/Management";
import { AddFoodItemForm } from './pages/EditFoodMenu';
import { LoginForm } from "./pages/LoginForm";
import { SignUpForm } from "./pages/SignUpForm";
import { UserDto } from "./models/UserDto";

interface AppRoutesProps {
  currentUser?: UserDto;
  setCurrentUser: (user: UserDto) => void;
  showSignUp: boolean;
  setShowSignUp: (value: boolean) => void;
}

const AppRoutes = ({
  currentUser,
  setCurrentUser,
  showSignUp,
  setShowSignUp,
}: AppRoutesProps) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Movies />} />
      <Route path="/theaters" element={<Theaters />} />

      {/* Protected Routes */}
      <Route
        path="/tickets"
        element={currentUser ? <Tickets /> : <Navigate to="/login" />}
      />
      <Route
        path="/food"
        element={currentUser ? <Food /> : <Navigate to="/login" />}
      />
      <Route
        path="/account"
        element={currentUser ? <Account currentUser={currentUser}/> : <Navigate to="/login" />}
      />
      <Route
        path="/management"
        element={currentUser ? <Management /> : <Navigate to="/login" />}
      />
      <Route
        path="/editmenu"
        element={currentUser ? <AddFoodItemForm /> : <Navigate to="/login" />}
      />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          showSignUp ? (
            <SignUpForm
              onSignUpSuccess={(user) => setCurrentUser(user)}
              onSwitchToLogin={() => setShowSignUp(false)}
            />
          ) : (
            <LoginForm
              onLoginSuccess={(user) => setCurrentUser(user)}
              onSwitchToSignUp={() => setShowSignUp(true)}
            />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
