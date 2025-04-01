import "../styles/Management.css";
import { useNavigate } from "react-router-dom";

const Management = () => {
    const navigate = useNavigate();
    
    return (
        <div className="management-container">
            <h1 className="management-title">Management</h1>
            <button className="management-btn" onClick={() => navigate("/editmenu")}>Edit Food Menu</button>
            <button className="management-btn" onClick={() => navigate("/editmovie")}>Edit Movies</button>
            <button className="management-btn" onClick={() => navigate("/editshowtime")}>Edit Showtimes</button>
        </div>
    );
};

export default Management;
