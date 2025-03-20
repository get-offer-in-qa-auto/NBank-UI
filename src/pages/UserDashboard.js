import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "/api";

function UserDashboard() {
    const [accounts, setAccounts] = useState([]);
    const [depositAmounts, setDepositAmounts] = useState({});
    const [profile, setProfile] = useState({ name: "" });


    // ✅ Retrieve stored auth token from localStorage
    const authHeader = localStorage.getItem("authToken");

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        if (!authHeader) {
            alert("Unauthorized! Please log in again.");
            return;
        }

        try {
            const response = await axios.get(`${BASE_URL}/customer/accounts`, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": authHeader // 🔹 Force adding Authorization header
                },
                withCredentials: true
            });
            setAccounts(response.data);
        } catch (error) {
            alert("Failed to fetch accounts");
        }
    };

    const depositMoney = async (accountId) => {
        const amount = depositAmounts[accountId] || 0;
        if (amount <= 0) {
            alert("Enter a valid deposit amount.");
            return;
        }

        try {
            await axios.post(`${BASE_URL}/accounts/deposit`, { accountId, amount }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": authHeader // 🔹 Force adding Authorization header
                },
                withCredentials: true
            });
            fetchAccounts(); // ✅ Refresh after deposit
            setDepositAmounts({ ...depositAmounts, [accountId]: "" }); // ✅ Reset input field
        } catch (error) {
            alert("Failed to deposit");
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/profile`, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": authHeader // 🔹 Force adding Authorization header
                },
                withCredentials: true
            });
            setProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            alert("Failed to load profile");
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "Unknown date"; // ✅ Handle missing timestamps
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            weekday: "short", // Thu
            month: "short",   // Mar
            day: "2-digit",   // 20
            year: "numeric",  // 2025
        }) + `, ${date.toLocaleTimeString("en-US")}`; // ✅ Add time (12-hour format)
    };



    return (
        <div className="container mt-4">
            <h1 className="text-center">User Dashboard</h1>
            <h2 className="text-center">Welcome, {profile.name ? (
                <span style={{ color: "#08fc04", fontWeight: "bold" }}>
            {profile.name}
        </span>
            ) : (
                <span style={{ color: "#fc1589", fontWeight: "bold" }}>
            noname
        </span>
            )}!</h2> {/* ✅ Show Name */}


            {/* ✅ Show Message If No Accounts Exist */}
            {accounts.length === 0 ? (
                <p className="text-center">You do not have accounts yet.</p>
            ) : (
                <div className="row justify-content-center mt-4">
                    {accounts.map((acc) => (
                        <div key={acc.id} className="col-md-6">
                            <div className="card shadow-custom p-3 mb-3">
                                <h4>Account: {acc.accountNumber}</h4>
                                <p><strong>Balance:</strong> ${acc.balance.toFixed(2)}</p>

                                {/* ✅ Show Transactions or Message */}
                                <h5 className="mt-3">Recent Transactions</h5>
                                {acc.transactions.length === 0 ? (
                                    <p className="no-transactions-message">No transactions yet.</p>
                                ) : (
                                    <ul className="list-group">
                                        {acc.transactions.slice(0, 5).map((tx) => (
                                            <li key={tx.id} className="list-group-item">
                                                <strong>{tx.type}:</strong> ${tx.amount.toFixed(2)}
                                                <span className="text-muted"> ({formatDate(tx.timestamp)})</span> {/* ✅ Show Date */}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserDashboard;
