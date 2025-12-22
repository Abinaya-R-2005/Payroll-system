import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const EmployeeDashboard = () => {
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
                        <h1 className="title-gradient" style={{ fontSize: '2rem' }}>Employee Portal</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Welcome back, view your financial records</p>
                    </div>
                    <Button onClick={handleLogout} variant="secondary">Sign Out</Button>
                </div>

                <div className="glass-panel">
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)', fontSize: '1.5rem' }}>Financial Overview</h2>

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
                            }}>Latest Net Pay</h3>
                            <p style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--primary)', marginTop: '10px' }}>$3,200.00</p>
                            <span style={{
                                display: 'inline-block',
                                marginTop: '10px',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                background: '#dcfce7',
                                color: '#166534',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                            }}>Paid • Dec 25, 2025</span>
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
                            }}>YTD Earnings</h3>
                            <p style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '10px' }}>$42,500.00</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>Gross Income</p>
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
                            }}>Tax Deductions (YTD)</h3>
                            <p style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--secondary)', marginTop: '10px' }}>$8,450.00</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>~20% Rate</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
