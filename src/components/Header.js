import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Header = ({ theme, auth, user }) => {
    // ✅ Choose logo dynamically based on the theme
    const logoSrc = theme === "dark" ? "/images/logo_dark.png" : "/images/logo_light.png";

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken"); // ✅ Clear stored auth token
        localStorage.removeItem("authUser");  // ✅ Remove user info if stored
        navigate("/login"); // ✅ Redirect to login page
    };

    return (
        <header className={`header ${theme === "dark" ? "dark-theme" : ""} shadow-custom`}>
            <div className="container d-flex align-items-center justify-content-between">
                <div to="/" className="d-flex align-items-center text-decoration-none">
                    <img src={logoSrc} alt="Bank Logo" className="logo me-3" />
                    <h1>NoBugs Bank</h1>
                </div>
            </div>
            {/* ✅ Show User Info in the Corner */}
            {user && (
                <div className="profile-header" onClick={() => navigate("/edit-profile")} style={{cursor: "pointer"}}>

                    <div className="user-info" style={{paddingRight: "20px"}}> {/* ✅ Add padding */}
                        <span className="user-name">{user.name || "Noname"}</span>
                        <br/>
                        <span className="user-username">@{user.username}</span>
                    </div>
                </div>

            )}

                    <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
                    {/* ✅ Log Out Button */}
                </header>
            );
            };

            export default Header;
