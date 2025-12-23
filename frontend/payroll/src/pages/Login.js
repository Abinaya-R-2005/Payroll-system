import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

import '../styles/Login.css';

const Login = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    const role = searchParams.get('role') || 'employee';
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
  e.preventDefault();

  const success = await login(
    formData.email,
    formData.password,
    role
  );

  if (success) {
    navigate(
      role === "admin"
        ? "/admin-dashboard"
        : "/employee-dashboard"
    );
  }
};



    return (
        <div className="login-container">
            <div className="login-card fade-in">
                <div className="login-header">
                    <h2 className="login-title">{role === 'admin' ? 'Admin' : 'Employee'} Login</h2>
                    <p className="login-subtitle">Welcome back, please sign in</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Button type="submit" variant="primary" className="btn-modern btn-primary w-full">
                        Sign In
                    </Button>
                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account? <Link to={`/register?role=${role}`} className="link-highlight">Register here</Link>
                    </p>
                    <Link to="/" className="back-link">← Back to Role Selection</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
