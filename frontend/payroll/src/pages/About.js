import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../styles/About.css";

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page-container fade-in">
            <div className="about-glass-panel">
                <div className="about-header">
                    <h1 className="title-gradient">About Us</h1>
                    <p>Fly Towards Digital Innovation</p>
                </div>

                <div className="about-content">
                    <p>
                        Fly Towards Digital Innovation is a growth-oriented technology partner
                        dedicated to empowering businesses through cutting-edge IT solutions
                        and digital transformation. Our mission is to bridge the gap between
                        complex technology and practical business needs, enabling organizations
                        to optimize their performance, visibility, and operational efficiency
                        in an increasingly digital landscape. Driven by a commitment to
                        innovation and excellence, we deliver end-to-end software services
                        that focus on measurable results and sustainable growth.
                    </p>
                    <p>
                        Building on our foundation of digital innovation, this Payroll Management
                        System is designed to streamline critical administrative operations
                        through automation and intelligent data management. By simplifying
                        complex payroll calculations, tax compliance, and attendance tracking,
                        the system minimizes manual intervention and eliminates the risk of
                        human error. It serves as a centralized hub for organizational workflows,
                        ensuring that payroll processing is both agile and reliable.
                    </p>
                    <p>
                        Designed with both management and employees in mind, our platform
                        prioritizes transparency and accessibility. For management, it provides
                        data-driven insights and comprehensive reporting to facilitate informed
                        decision-making. Simultaneously, it empowers employees with a modern,
                        user-friendly interface for accessing personal payroll records and
                        professional details. At Fly Towards, we believe that smart technology
                        should foster trust and efficiency, creating a seamless experience
                        for every member of the organization.
                    </p>
                </div>

                <div className="about-footer">
                    <Button onClick={() => navigate(-1)} className="btn-modern btn-primary">
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default About;
