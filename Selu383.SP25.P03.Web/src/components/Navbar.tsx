import { NavLink, useNavigate } from "react-router-dom";
import { UserDto } from "../models/UserDto";
import "../styles/Navbar.css";

interface NavbarProps {
  currentUser?: UserDto;
  setCurrentUser: (user: UserDto | undefined) => void;
}

const Navbar = ({ currentUser, setCurrentUser }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(undefined);
    navigate("/"); // Go back to homepage after logout
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        Movies
      </NavLink>
      <NavLink to="/theaters" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        Theaters
      </NavLink>

      {/* Protected links only visible when logged in */}
      {currentUser && (
        <>
          <NavLink to="/tickets" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Tickets
          </NavLink>
          <NavLink to="/food" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Food
          </NavLink>
          <NavLink to="/account" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Account
          </NavLink>
        </>
      )}

      {/* Auth buttons */}
      <div className="auth-link">
        {currentUser ? (
          <button onClick={handleLogout} className="navbar-button">Logout</button>
        ) : (
          <NavLink to="/login" className="navbar-button">Login</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
