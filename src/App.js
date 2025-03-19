import React, { useState, useEffect } from "react"; // ✅ Added useEffect
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Header from "./components/Header"; // ✅ Import Header
import AdminPanel from "./pages/AdminPanel";
import UserDashboard from "./pages/UserDashboard";

function App() {
    const [theme, setTheme] = useState("light");
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const now = new Date();
        const hours = now.getHours();

        if (hours >= 18 || hours < 6) {
            setTheme("dark");
            document.documentElement.setAttribute("data-bs-theme", "dark"); // ✅ Bootstrap Dark Mode
        } else {
            setTheme("light");
            document.documentElement.setAttribute("data-bs-theme", "light"); // ✅ Bootstrap Light Mode
        }

        console.log("Applied theme:", document.documentElement.getAttribute("data-bs-theme"));
    }, []);

    return (
        <Router>
            <Header theme={theme} auth={auth} />
            <Routes>
                <Route path="/login" element={<Login setAuth={setAuth} theme={theme} />} />
                <Route path="/admin" element={auth?.role === "ADMIN" ? <AdminPanel auth={auth} theme={theme} /> : <Navigate to="/" />} />
                <Route path="/dashboard" element={auth?.role === "USER" ? <UserDashboard auth={auth} theme={theme} /> : <Navigate to="/" />} />
                <Route path="/" element={<Login setAuth={setAuth} theme={theme} />} />
            </Routes>
        </Router>
    );
}

export default App;
