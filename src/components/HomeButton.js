import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function HomeButton() {
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ Hide the button if the user is already on the dashboard
    if (location.pathname === "/dashboard") {
        return null;
    }

    return (
        <button
            className="btn btn-outline-primary position-fixed"
            onClick={() => navigate("/dashboard")}
            style={{
                bottom: "20px",
                right: "20px",
                padding: "10px 20px",
                fontSize: "18px",
                zIndex: 1050, // Ensures it's above other elements
            }}
        >
            🏠 Home
        </button>
    );
}

export default HomeButton;
