import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isDashboard =
    location.pathname.includes("employee-dashboard") ||
    location.pathname.includes("admin-dashboard");

  // hide navbar completely on certain pages if needed, but currently keeping it glassmorphic
  const hideNavbar = false;

  if (hideNavbar) return null;

  return (
    <nav style={{
      ...styles.nav,
      ...(isDashboard ? styles.dashboardNav : {})
    }}>
      <div style={styles.container}>
        <div style={styles.logoContainer}>
          {location.pathname !== "/" && (
            <button onClick={() => navigate(-1)} style={styles.backBtn} title="Go Back">
              ←
            </button>
          )}
          <Link to="/" style={styles.logoLink}>
            <img
              src="https://flytowardsdigitalinnovation.com/wp-content/uploads/2025/07/cropped-DIGITAL_INNOVATION-removebg-preview-1-1-1.png"
              alt="Fly Towards Digital Innovation"
              style={styles.logoImage}
            />
            <div style={styles.logoText}>
              <span style={{ color: "var(--primary)" }}>Fly</span>
              <span style={{ color: "var(--text-main)" }}>Payroll</span>
            </div>
          </Link>
        </div>

        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          {!user && (
            <>
              <Link to="/login?role=admin" style={{ ...styles.link, ...styles.adminBtn }}>
                ADMIN
              </Link>
              <Link to="/login?role=employee" style={{ ...styles.link, ...styles.employeeBtn }}>
                EMPLOYEE
              </Link>
            </>
          )}
          {user && (
            <div style={styles.userInfo}>
              <span style={styles.userRole}>{user.role?.toUpperCase()}</span>
              <span style={styles.userName}>
                {user.fullName || user.email?.split('@')[0]}
              </span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 100,
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
  },
  dashboardNav: {
    background: "rgba(255, 255, 255, 0.6)",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 30px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  backBtn: {
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "var(--text-main)",
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "1.2rem",
    marginRight: "15px",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(4px)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    gap: '12px',
  },
  logoImage: {
    height: "45px",
    width: "auto",
    objectFit: "contain",
  },
  logoText: {
    fontSize: "1.7rem",
    fontWeight: "800",
    letterSpacing: "-0.8px",
    lineHeight: 1,
  },
  links: {
    display: "flex",
    gap: "25px",
    alignItems: "center",
  },
  link: {
    color: "var(--text-main)",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "600",
    transition: "color 0.2s",
  },
  adminBtn: {
    background: "var(--ocean-gradient)",
    padding: "10px 24px",
    borderRadius: "50px",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(12, 74, 110, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    fontWeight: "700",
  },
  employeeBtn: {
    background: "var(--fly-gradient)",
    padding: "10px 24px",
    borderRadius: "50px",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(14, 165, 233, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    fontWeight: "700",
  },
  userInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255, 255, 255, 0.4)",
    padding: "6px 16px",
    borderRadius: "50px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
  userName: {
    color: "var(--text-main)",
    fontSize: "15px",
    fontWeight: "700",
  },
  userRole: {
    color: "var(--primary)",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
    background: "var(--secondary)",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  logoutBtn: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    marginLeft: "8px",
    transition: "all 0.2s",
  }
};

export default Navbar;
