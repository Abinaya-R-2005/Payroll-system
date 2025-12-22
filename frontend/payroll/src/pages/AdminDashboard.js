import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={{ padding: '40px 20px' }} className="fade-in">
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid var(--border-color)'
                }}>
                    <div>
                        <h1 className="title-gradient" style={{ fontSize: '2rem' }}>Admin Portal</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Overview of company payroll and employees</p>
                    </div>
                    <Button onClick={handleLogout} variant="secondary">Sign Out</Button>
                </div>

                <div className="glass-panel">
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)', fontSize: '1.5rem' }}>Dashboard Overview</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                        <div style={{
                            padding: '30px',
                            background: '#fff',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <h3 style={{
                                fontSize: '0.85rem',
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontWeight: '600'
                            }}>Total Employees</h3>
                            <p style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '10px' }}>124</p>
                            <p style={{ color: '#16a34a', fontSize: '0.9rem', marginTop: '5px', fontWeight: '500' }}>+4 new this month</p>
                        </div>

                        <div style={{
                            padding: '30px',
                            background: '#fff',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <h3 style={{
                                fontSize: '0.85rem',
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontWeight: '600'
                            }}>Payroll Pending</h3>
                            <p style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--primary)', marginTop: '10px' }}>$45,200</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>Due in 3 days</p>
                        </div>

                        <div style={{
                            padding: '30px',
                            background: '#fff',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <h3 style={{
                                fontSize: '0.85rem',
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontWeight: '600'
                            }}>Next Pay Date</h3>
                            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '18px' }}>Dec 31, 2025</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
