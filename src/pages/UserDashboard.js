import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "/api";

function UserDashboard() {
    const [accounts, setAccounts] = useState([]);
    const [depositAmounts, setDepositAmounts] = useState({});

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

    return (
        <div className="container mt-4">
            <h1 className="text-center">User Dashboard</h1>

            {/* ✅ Show User Accounts */}
            <div className="row justify-content-center">
                {accounts.map((acc) => (
                    <div key={acc.id} className="col-md-6">
                        <div className="card shadow-custom p-3 mb-3">
                            <h4>Account: {acc.accountNumber}</h4>
                            <p><strong>Balance:</strong> ${acc.balance.toFixed(2)}</p>

                            {/* ✅ Deposit Money */}
                            <div className="input-group mb-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Amount"
                                    value={depositAmounts[acc.id] || ""}
                                    onChange={(e) =>
                                        setDepositAmounts({ ...depositAmounts, [acc.id]: e.target.value })
                                    }
                                />
                                <button className="btn btn-success" onClick={() => depositMoney(acc.id)}>
                                    Deposit
                                </button>
                            </div>

                            {/* ✅ Show Transactions */}
                            <h5 className="mt-3">Recent Transactions</h5>
                            <ul className="list-group">
                                {acc.transactions.length > 0 ? (
                                    acc.transactions.slice(0, 5).map((tx) => (
                                        <li key={tx.id} className="list-group-item">
                                            <strong>{tx.type}:</strong> ${tx.amount.toFixed(2)}
                                            <span className="text-muted"> ({tx.date})</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item text-muted">No transactions yet</li>
                                )}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserDashboard;
