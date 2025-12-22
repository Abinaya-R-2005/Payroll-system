import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import '../styles/Register.css';

const Register = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { register } = useAuth();
    const role = searchParams.get('role') || 'employee';

    const [formData, setFormData] = useState({
        // 1. Personal Identity
        fullName: '', dob: '', personalEmail: '', phone: '', address: '', taxStatus: 'Single',
        // 2. Banking
        accountName: '', accountNumber: '', bankCode: '', accountType: 'Savings',
        // 3. Employment
        employeeId: '', jobTitle: '', department: '', joiningDate: '', workLocation: '',
        // 4. Security
        emergencyName: '', emergencyRel: '', emergencyPhone: '', consent: false,
        // 5. Login
        email: '', password: '', confirmPassword: ''
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        register({ ...formData, role });
        // After reg, usually redirect to login or dashboard. Redirecting to login for now.
        navigate(`/login?role=${role}`);
    };

    const SectionTitle = ({ children }) => (
        <h3 className="section-title">
            {children}
        </h3>
    );

    return (
        <div className="register-container fade-in">
            <div className="register-card">
                <div className="register-header">
                    <h2 className="register-title">{role === 'admin' ? 'Admin' : 'Employee'} Registration</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Complete your profile to join the system</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <SectionTitle>1. Personal Identity Details</SectionTitle>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <Input label="Full Legal Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
                            <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
                            <Input label="Personal Email" name="personalEmail" type="email" value={formData.personalEmail} onChange={handleChange} required />
                            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                            <div style={{ gridColumn: '1 / -1' }}>
                                <Input label="Home Address" name="address" value={formData.address} onChange={handleChange} required />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.25rem' }}>
                                <label style={{ marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tax Filing Status</label>
                                <select name="taxStatus" value={formData.taxStatus} onChange={handleChange} style={{
                                    padding: '0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.8)', color: 'var(--text-main)', outline: 'none'
                                }}>
                                    <option>Single</option>
                                    <option>Married</option>
                                    <option>Head of Household</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <SectionTitle>2. Banking Details (Direct Deposit)</SectionTitle>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <Input label="Account Holder Name" name="accountName" value={formData.accountName} onChange={handleChange} required />
                            <Input label="Bank Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
                            <Input label="IFSC / Routing Code" name="bankCode" value={formData.bankCode} onChange={handleChange} required />
                            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.25rem' }}>
                                <label style={{ marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Account Type</label>
                                <select name="accountType" value={formData.accountType} onChange={handleChange} style={{
                                    padding: '0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.8)', color: 'var(--text-main)', outline: 'none'
                                }}>
                                    <option>Savings</option>
                                    <option>Current</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <SectionTitle>3. Employment Details</SectionTitle>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <Input label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
                            <Input label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
                            <Input label="Department" name="department" value={formData.department} onChange={handleChange} required />
                            <Input label="Joining Date" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} required />
                            <Input label="Work Location" name="workLocation" value={formData.workLocation} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-section">
                        <SectionTitle>4. Security & Emergency</SectionTitle>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <Input label="Emergency Contact Name" name="emergencyName" value={formData.emergencyName} onChange={handleChange} required />
                            <Input label="Relationship" name="emergencyRel" value={formData.emergencyRel} onChange={handleChange} required />
                            <Input label="Emergency Contact Phone" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} required />
                        </div>
                        <div style={{ margin: '20px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} id="consent" required style={{ width: '20px', height: '20px' }} />
                            <label htmlFor="consent" style={{ color: 'var(--text-muted)' }}>I agree to the Payroll & Privacy Policy (Digital Consent)</label>
                        </div>
                    </div>

                    <div className="form-section">
                        <SectionTitle>5. Login Credentials</SectionTitle>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                            <Input label="Login Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                                <Input label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <Button type="submit" variant="primary" className="btn-modern btn-primary" style={{ width: '100%', maxWidth: '300px', fontSize: '1.1rem' }}>Complete Registration</Button>
                    </div>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Link to={`/login?role=${role}`} style={{ color: 'var(--text-muted)' }}>Already have an account? Login</Link>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Register;
