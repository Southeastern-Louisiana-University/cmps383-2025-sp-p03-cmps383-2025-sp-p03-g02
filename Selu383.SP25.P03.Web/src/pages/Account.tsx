import "../styles/Account.css"; 
import { useNavigate } from "react-router-dom";
import { UserDto } from "../models/UserDto";

interface AccountProps {
  currentUser: UserDto;
}

const Account = ({ currentUser }: AccountProps) => {
  const navigate = useNavigate();

  return (
    <div className="account-container">
      <h1 className="account-title">My Account</h1>
      <div className="account-info">
        <h2 className="account-info">{currentUser?.userName || "Unknown User"}</h2>
      </div>
      <button className="account-btn">Edit Profile</button>
      <button className="account-btn">Payment Methods</button>
      <button className="account-btn">Help Center</button>

      {(currentUser.roles.includes("Admin") || currentUser.roles.includes("WaitStaff")) && (
        <button className="account-btn" onClick={() => navigate("/management")}>
          Management
        </button>
      )}
    </div>
  );
};

export default Account;
