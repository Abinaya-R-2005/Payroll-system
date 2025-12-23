import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const displayName = user?.fullName || "Employee";

  return (
    <div style={styles.page}>
      <div style={styles.glassCard}>

        {/* Top Bar */}
        <div style={styles.topBar}>
          <h2 style={styles.welcome}>Welcome, {displayName} 👋</h2>

          {/* Profile Icon */}
          <div style={{ position: "relative" }}>
            <div
              style={styles.profileCircle}
              onClick={() => setShowMenu(!showMenu)}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>

            {/* Dropdown Menu */}
            {showMenu && (
              <div style={styles.dropdown}>
                <p style={styles.userName}>{displayName}</p>
                <p style={styles.userEmail}>{user?.email}</p>

                <hr />

                <button
                  style={styles.menuBtn}
                  onClick={() => navigate("/employee-profile")}
                >
                  View Profile
                </button>

                <button
                  style={styles.menuBtn}
                  onClick={() => navigate("/payslip")}
                >
                  View Payslip
                </button>

                <button style={styles.logoutBtn} onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <p style={styles.text}>
          Your dashboard is ready. Payslip and other modules will be available
          once the admin completes setup.
        </p>
      </div>
    </div>
  );
};

/* 🔹 Internal CSS */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  glassCard: {
    width: "900px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    padding: "30px",
    borderRadius: "16px",
    color: "#fff",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcome: {
    margin: 0,
  },
  profileCircle: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontWeight: "bold",
  },
  dropdown: {
    position: "absolute",
    top: "55px",
    right: 0,
    background: "#fff",
    color: "#000",
    borderRadius: "10px",
    padding: "15px",
    width: "220px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    zIndex: 100,
  },
  userName: {
    fontWeight: "bold",
    margin: 0,
  },
  userEmail: {
    fontSize: "0.85rem",
    color: "#555",
    marginBottom: "10px",
  },
  menuBtn: {
    width: "100%",
    padding: "8px",
    marginTop: "8px",
    border: "none",
    background: "#f1f1f1",
    cursor: "pointer",
    borderRadius: "5px",
  },
  logoutBtn: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    border: "none",
    background: "#e74c3c",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "5px",
  },
  text: {
    marginTop: "40px",
    textAlign: "center",
  },
};

export default EmployeeDashboard;
