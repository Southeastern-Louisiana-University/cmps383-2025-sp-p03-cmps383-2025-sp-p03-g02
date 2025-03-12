import { NavLink } from "react-router-dom";
import "../styles/Navbar.css"; // Import the CSS file

const Navbar = () => {
    return (
        <nav className="navbar">
            <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
                Movies
            </NavLink>
            <NavLink 
                to="/theaters" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
                Theaters
            </NavLink>
            <NavLink 
                to="/tickets" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
                Tickets
            </NavLink>
            <NavLink 
                to="/food" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
                Food
            </NavLink>
            <NavLink 
                to="/account" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
                Account
            </NavLink>
        </nav>
    );
};

export default Navbar;
