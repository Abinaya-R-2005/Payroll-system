import React, { useState, useEffect } from 'react';
import Button from './Button';

const LeaveBalancePanel = ({ employee, onUpdateBalances }) => {
    const [balances, setBalances] = useState({
        casual: 0,
        sick: 0,
        earned: 0
    });
    const [editing, setEditing] = useState(false);

    // Sync state if employee changes
    useEffect(() => {
        if (employee && employee.leaveBalances) {
            setBalances(employee.leaveBalances);
        }
    }, [employee]);

    const handleSave = async () => {
        try {
            await onUpdateBalances(employee.employeeId, balances);
            setEditing(false);
        } catch (err) {
            console.error("Failed to save balances", err);
        }
    };

    const handleChange = (type, value) => {
        setBalances(prev => ({
            ...prev,
            [type]: parseInt(value) || 0
        }));
    };

    return (
        <div className="glass-panel" style={{ marginTop: '20px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: '800' }}>
                    📅 Leave Inventory
                </h3>
                <Button
                    variant={editing ? "secondary" : "primary"}
                    onClick={() => setEditing(!editing)}
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                    {editing ? "Cancel" : "Adjust Balances"}
                </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
                {[
                    { label: 'Casual', key: 'casual', icon: '🏝️' },
                    { label: 'Sick', key: 'sick', icon: '🤒' },
                    { label: 'Earned', key: 'earned', icon: '💼' }
                ].map(item => (
                    <div key={item.key} className="fly-card" style={{ padding: '15px', textAlign: 'center', background: editing ? '#f8fafc' : 'white' }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.icon}</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                            {item.label}
                        </div>
                        {editing ? (
                            <input
                                type="number"
                                value={balances[item.key]}
                                onChange={(e) => handleChange(item.key, e.target.value)}
                                style={{
                                    width: '70px',
                                    textAlign: 'center',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    color: 'var(--primary)'
                                }}
                                min="0"
                            />
                        ) : (
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                {employee.leaveBalances?.[item.key] ?? 0}
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '4px' }}>DAYS</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {editing && (
                <div style={{ marginTop: '20px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        style={{ padding: '8px 24px', fontWeight: '700' }}
                    >
                        Save Inventory
                    </Button>
                </div>
            )}
        </div>
    );
};

export default LeaveBalancePanel;
