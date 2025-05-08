import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {BASE_URL} from "../App";


function EditProfile({ setUser }) {  // ✅ Accept setUser prop
    const [newName, setNewName] = useState("");
    const navigate = useNavigate();
    const authHeader = localStorage.getItem("authToken");
    const [currentName, setCurrentName] = useState("");

    // ✅ Fetch current profile on mount
    useEffect(() => {
        axios.get(`${BASE_URL}/customer/profile`, {
            headers: { Authorization: authHeader },
            withCredentials: true
        }).then(response => {
            const name = response.data.name || "";
            setCurrentName(name);
            setNewName(name);
        }).catch(error => {
            console.error("❌ Failed to load profile:", error);
            alert("❌ Failed to load profile.");
        });
    }, [authHeader]);

    const handleSubmit = async () => {
        if (!newName.trim()) {
            alert("❌ Please enter a valid name.");
            return;
        }

        if (newName.trim() === currentName?.trim()) {
            alert("⚠️ New name is the same as the current one.");
            return;
        }

        try {
            await axios.put(`${BASE_URL}/customer/profile`, { name: newName }, {
                headers: { Authorization: authHeader },
                withCredentials: true
            });

            alert("✅ Name updated successfully!");
        } catch (error) {
            console.error("❌ Failed to update name:", error);
            const backendMessage = error.response?.data || "❌ Failed to update name. Please try again.";
            alert(backendMessage);
            return; // ❗️Не продолжаем дальше
        }

        try {
            const response = await axios.get(`${BASE_URL}/customer/profile`, {
                headers: { Authorization: authHeader },
                withCredentials: true
            });

            setUser(response.data);
            navigate("/dashboard");
        } catch (error) {
            console.warn("⚠️ Updated but failed to refresh user profile:", error);
        }
    };

    return (
        <div className="container mt-5 text-center">
            <h1>✏️ Edit Profile</h1>
            <input
                type="text"
                className="form-control mt-3"
                placeholder="Enter new name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
            />
            <button className="btn btn-primary mt-3" onClick={handleSubmit}>
                💾 Save Changes
            </button>
        </div>
    );
}

export default EditProfile;
