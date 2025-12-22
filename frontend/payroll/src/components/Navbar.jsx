import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>PayrollPro</h2>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    backgroundColor: "#0f172a",
    color: "#fff"
  },
  logo: {
    margin: 0
  },
  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center"
  },
  link: {
    color: "#e5e7eb",
    textDecoration: "none",
    fontSize: "16px"
  },
  signupBtn: {
    backgroundColor: "#38bdf8",
    color: "#0f172a",
    padding: "8px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "500"
  }
};

export default Navbar;
