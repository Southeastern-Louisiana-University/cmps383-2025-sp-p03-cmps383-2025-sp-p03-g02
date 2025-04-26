import { Routes, Route, Navigate } from "react-router-dom";
import Movies from "./pages/Movies";
import Theaters from "./pages/Theaters";
import Tickets from "./pages/Tickets";
import Food from "./pages/Food";
import Account from "./pages/Account";
import Management from "./pages/Management";
import { AddFoodItemForm } from "./pages/EditFoodMenu";
import  ViewOrdersPage  from "./pages/EditOrders";
import { AddMovieForm } from "./pages/EditMovie";
import { AddShowTimeForm } from "./pages/EditShowTimes";
import { AddTicketForm } from './pages/EditTicket';
import ViewBookingsPage from "./pages/EditBookings";
import { AddSeatForm } from "./pages/EditSeats";
import { LoginForm } from "./pages/LoginForm";
import { SignUpForm } from "./pages/SignUpForm";
import { UserDto } from "./models/UserDto";
import PaymentPage from "./pages/PaymentPage";

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
      <Route path="/food" element={<Food />} />

      {/* Protected Routes */}
      <Route
        path="/tickets"
        element={currentUser ? <Tickets /> : <Navigate to="/" />}
      />
      <Route
        path="/account"
        element={
          currentUser ? (
            <Account currentUser={currentUser} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/management"
        element={currentUser ? <Management currentUser={currentUser}/> : <Navigate to="/" />}
      />
      <Route
        path="/editmenu"
        element={currentUser ? <AddFoodItemForm /> : <Navigate to="/" />}
      />
      <Route
        path="/vieworders"
        element={currentUser ? <ViewOrdersPage /> : <Navigate to="/" />}
      />
      <Route
        path="/editmovie"
        element={currentUser ? <AddMovieForm /> : <Navigate to="/" />}
      />
      <Route
        path="/viewticket"
        element={currentUser ? <AddTicketForm /> : <Navigate to="/" />}
      />

      <Route
        path="/viewbookings"
        element={currentUser ? <ViewBookingsPage /> : <Navigate to="/" />}
      />

      <Route
        path="/editseat"
        element={currentUser ? <AddSeatForm /> : <Navigate to="/" />}
      />

      <Route
        path="/editshowtime"
        element={currentUser ? <AddShowTimeForm /> : <Navigate to="/" />}
      />

      <Route path="/payment" element={<PaymentPage />} />

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
