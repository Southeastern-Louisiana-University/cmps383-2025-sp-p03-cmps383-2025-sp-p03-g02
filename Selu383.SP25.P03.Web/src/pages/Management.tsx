import "../styles/Management.css";
import { useNavigate } from "react-router-dom";
import { UserDto } from "../models/UserDto";

interface AccountProps {
    currentUser: UserDto;
}

const Management = ({ currentUser }: AccountProps) => {
    const navigate = useNavigate();
    const isAdmin = currentUser.roles.includes("Admin");
    const isWaitStaff = currentUser.roles.includes("WaitStaff");

    return (
        <div className="management-container">
            <h1 className="management-title">Management</h1>
            
            {/* Admin-only features */}
            {isAdmin && (
                <>
                    <button className="management-btn" onClick={() => navigate("/editmenu")}>
                        Edit Food Menu
                    </button>
                    <button className="management-btn" onClick={() => navigate("/editmovie")}>
                        Edit Movies
                    </button>
                    <button className="management-btn" onClick={() => navigate("/editseat")}>
                        Edit Seats
                    </button>
                    <button className="management-btn" onClick={() => navigate("/editshowtime")}>
                        Edit Showtimes
                    </button>
                    <button className="management-btn" onClick={() => navigate("/viewticket")}>
                        View Tickets
                    </button>
                </>
            )}

            {/* Shared features (Admin + WaitStaff) */}
            {(isAdmin || isWaitStaff) && (
                <>
                    <button className="management-btn" onClick={() => navigate("/viewbookings")}>
                        View Bookings
                    </button>
                    <button className="management-btn" onClick={() => navigate("/vieworders")}>
                        View Orders
                    </button>
                </>
            )}
        </div>
    );
};

export default Management;