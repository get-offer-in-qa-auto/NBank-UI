import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Header from "./components/Header";
import AdminPanel from "./pages/AdminPanel";
import UserDashboard from "./pages/UserDashboard";
import Deposit from "./pages/Deposit";
import Transfer from "./pages/Transfer";
import HomeButton from "./components/HomeButton"; // ✅ Import HomeButton
import EditProfile from "./pages/EditProfile"; // ✅ Import New Page
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4111/api";
const apiVersion = process.env.REACT_APP_API_VERSION || "v1";
export const BASE_URL = `${apiUrl}/${apiVersion}`;

function App() {
    const [theme, setTheme] = useState("light");
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState(null); // ✅ Ensure auth is set properly
    const [loading, setLoading] = useState(true);
    const authHeader = localStorage.getItem("authToken");

    useEffect(() => {
        // 🔹 Theme Selection Based on Time
        const now = new Date();
        const hours = now.getHours();
        const newTheme = hours >= 18 || hours < 6 ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-bs-theme", newTheme);

        console.log("🌙 Applied theme:", document.documentElement.getAttribute("data-bs-theme"));

        // 🔹 Fetch Profile Only If Auth Token Exists
        const fetchProfile = async () => {
            // ✅ Fetch only if NOT an admin
            if (auth?.role === "ADMIN") {
                setLoading(false);
                return;
            }

            if (!authHeader) {
                console.warn("⚠️ No auth token found, skipping profile request.");
                setLoading(false);
                return;
            }

            try {
                console.log("🔹 Fetching user profile...");
                console.log(`${BASE_URL}`);
                const response = await axios.get(`${BASE_URL}/customer/profile`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": authHeader
                    },
                    withCredentials: true
                });

                console.log("✅ User profile received:", response.data);
                setUser(response.data);
                setAuth(response.data); // ✅ Update auth state
            } catch (error) {
                console.error("❌ Failed to fetch user profile:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [authHeader]);

    // ✅ Prevent Rendering Until Profile is Loaded
    if (loading) return <p className="text-center">🔄 Loading...</p>;

    return (
        <Router>
            <Header theme={theme} auth={auth} user={user}/>
            <Routes>
                <Route path="/login" element={<Login setAuth={setAuth} theme={theme}/>}/>
                <Route path="/admin"
                       element={auth?.role === "ADMIN" ? <AdminPanel auth={auth} theme={theme}/> : <Navigate to="/"/>}/>
                <Route path="/dashboard"
                       element={auth?.role === "USER" ? <UserDashboard auth={auth} theme={theme}/> : <Navigate to="/"/>}/>
                <Route path="/deposit" element={<Deposit/>}/>
                <Route path="/transfer" element={<Transfer/>}/>
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/" element={<Login setAuth={setAuth} theme={theme}/>}/>
            </Routes>
            {/* ✅ Show "Home" button on all screens except Dashboard */}
            <HomeButton />
        </Router>
    );
}

export default App;
