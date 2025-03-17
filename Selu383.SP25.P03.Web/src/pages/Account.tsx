import "../styles/Account.css";

const Account = () => {
    return (
        <div className="account-container">
            <h1 className="account-title">My Account</h1>
            <div className="account-info">
                <h2>John Doe</h2>
                <p>john.doe@yahoo.com</p>
            </div>
            <button className="account-btn">Edit Profile</button>
            <button className="account-btn">Payment Methods</button>
            <button className="account-btn">Help Center</button>
            <button className="sign-out-btn">Sign Out</button>
        </div>
    );
};

export default Account;
