import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';   // ✅ ONLY Button import
import SalarySlip from '../components/SalarySlip';

import '../styles/EmployeeDashboard.css';
import '../styles/Messages.css';
import '../styles/Button.css';



/* =========================
   OFFICE GEO LOCATION CONFIG
   ========================= */
const OFFICE_LAT = 9.57471;      // change to your office latitude
const OFFICE_LNG = 77.96361;      // change to your office longitude
const OFFICE_RADIUS = 200000;       // meters

/* =========================
   DISTANCE CALCULATION
   ========================= */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}



const EmployeeDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const weekdayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const [canMarkAttendance, setCanMarkAttendance] = useState(false);
    const [locationMsg, setLocationMsg] = useState('');

    // State
    const [employeeData, setEmployeeData] = useState(null);
    const [attendance, setAttendance] = useState({});
    const [payslipData, setPayslipData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewDate, setViewDate] = useState(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });
    const [myLeaves, setMyLeaves] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const viewMode = searchParams.get('v') || 'overview'; // 'overview' or 'slip'

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const viewingMonth = `${year}-${String(month + 1).padStart(2, '0')}`;


    // Fetch full employee details including payroll config
    useEffect(() => {
        if (!user?.email) return;

        const fetchDetails = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/employees');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                const currentEmp = data.find(emp => emp.email === user.email || emp.employeeId === user.employeeId);
                if (currentEmp) setEmployeeData(currentEmp);
            } catch (err) {
                console.warn('Error fetching employee details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [user]);
    useEffect(() => {
  if (!employeeData) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
  const userLat = pos.coords.latitude;
  const userLng = pos.coords.longitude;

  const distance = getDistance(
    userLat,
    userLng,
    OFFICE_LAT,
    OFFICE_LNG
  );

  console.log("User Lat:", userLat);
  console.log("User Lng:", userLng);
  console.log("Office Lat:", OFFICE_LAT);
  console.log("Office Lng:", OFFICE_LNG);
  console.log("Distance (meters):", distance);

  if (distance <= OFFICE_RADIUS) {
    setCanMarkAttendance(true);
    setLocationMsg(`✅ Inside office (${Math.round(distance)} m)`);
  } else {
    setCanMarkAttendance(false);
    setLocationMsg(`❌ Outside office (${Math.round(distance)} m)`);
  }
}
,
    () => {
      setCanMarkAttendance(false);
      setLocationMsg('❌ Location permission required');
    }
  );
}, [employeeData]);

    // Fetch attendance for the viewing month
    useEffect(() => {
        if (!employeeData?.employeeId) return;

        const fetchAttendance = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/attendance?employeeId=${encodeURIComponent(employeeData.employeeId)}&month=${viewingMonth}`);
                if (!res.ok) throw new Error('Failed to fetch attendance');
                const data = await res.json();

                let statuses = {};
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        if (item.date && item.status) statuses[item.date] = item.status;
                    });
                } else if (data && typeof data === 'object') {
                    statuses = data;
                }
                setAttendance(statuses);
            } catch (err) {
                console.warn('Error fetching attendance:', err);
                setAttendance({});
            }
        };

        const fetchPayslip = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/payslip?employeeId=${encodeURIComponent(employeeData.employeeId)}&month=${viewingMonth}`);
                if (!res.ok) throw new Error('Failed to fetch payslip');
                const data = await res.json();
                setPayslipData(data);
            } catch (err) {
                console.warn('Error fetching payslip:', err);
                setPayslipData(null);
            }
        };

        const fetchMyLeaves = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/leaves?employeeId=${encodeURIComponent(employeeData.employeeId)}`);
                if (res.ok) {
                    const data = await res.json();
                    setMyLeaves(data);
                }
            } catch (err) {
                console.warn('Error fetching my leaves:', err);
            }
        };

        fetchAttendance();
        fetchPayslip();
        fetchMyLeaves();
    }, [employeeData, viewingMonth]);

    // Calculations
    const stats = useMemo(() => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const p = Object.values(attendance).filter(s => s === 'P').length;
        const a = Object.values(attendance).filter(s => s === 'A').length;
        const l = Object.values(attendance).filter(s => s === 'L').length;
        return { totalDays: daysInMonth, present: p, absent: a, leave: l };
    }, [attendance, year, month]);

    const payrollResults = useMemo(() => {
        const payroll = payslipData?.earnings || employeeData?.payroll;
        if (!payroll) return { netPayable: 0, gross: 0, tax: 0, proRated: 0, deductions: 0, breakdown: {} };

        const { basicSalary, hra, splAllowance, travelAllowance, allowances, bonus, insteadDue } = payroll;
        const pf = payslipData?.deductions?.pf || employeeData?.payroll?.pf || 0;
        const taxRate = payslipData?.deductions?.taxPercent || employeeData?.payroll?.tax || 0;

        const basic = parseFloat(basicSalary) || 0;
        const h = parseFloat(hra) || 0;
        const spl = parseFloat(splAllowance) || 0;
        const travel = parseFloat(travelAllowance) || 0;
        const allow = parseFloat(allowances) || 0;
        const bns = parseFloat(bonus) || 0;
        const inst = parseFloat(insteadDue) || 0;
        const pfVal = parseFloat(pf) || 0;
        const tRate = parseFloat(taxRate) || 0;

        const gross = basic + h + spl + travel + allow + bns + inst;
        const proRated = stats.totalDays > 0 ? (gross / stats.totalDays) * stats.present : 0;
        const taxVal = proRated * (tRate / 100);
        const net = proRated - taxVal - pfVal;

        return {
            gross,
            proRated,
            tax: taxVal,
            pf: pfVal,
            deductions: taxVal + pfVal,
            netPayable: net,
            taxRate: tRate,
            breakdown: { basic, h, spl, travel, allow, bns, inst }
        };
    }, [employeeData, payslipData, stats]);

    const handlePrev = () => setViewDate(new Date(year, month - 1, 1));
    const handleNext = () => setViewDate(new Date(year, month + 1, 1));

    // Leave System State
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [leaveData, setLeaveData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        type: 'Casual'
    });
const markAttendance = async () => {
  const today = new Date().toISOString().split('T')[0];

  try {
    const res = await fetch('http://localhost:5000/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId: employeeData.employeeId,
        date: today,
        status: 'P'
      })
    });

    if (res.ok) {
      alert('Attendance marked successfully');
      setAttendance(prev => ({ ...prev, [today]: 'P' }));
    } else {
      alert('Attendance already marked');
    }
  } catch {
    alert('Server error');
  }
};

    const handleLeaveSubmit = async (e) => {
        e.preventDefault();

        // Calculate requested duration
        const start = new Date(leaveData.startDate);
        const end = new Date(leaveData.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Balance Validation
        const type = leaveData.type.toLowerCase();

        // Create final payload to avoid mutating state directly
        const submissionData = { ...leaveData };

        // Skip balance check for LOP
        if (leaveData.type !== 'Loss of Pay (LOP)') {
            const availableBalance = employeeData.leaveBalances ? employeeData.leaveBalances[type] : 0;

            if (diffDays > availableBalance) {
                const proceedAsLOP = window.confirm(
                    `Insufficient balance for ${leaveData.type} Leave.\n\nYou have ${availableBalance} days remaining, but you're requesting ${diffDays} days.\n\nWould you like to submit this as "Loss of Pay (LOP)" leave instead?`
                );

                if (proceedAsLOP) {
                    submissionData.type = 'Loss of Pay (LOP)';
                } else {
                    return;
                }
            }
        }

        try {
            const res = await fetch('http://localhost:5000/api/leaves', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...submissionData,
                    employeeId: employeeData.employeeId,
                    employeeName: employeeData.fullName
                })
            });

            if (res.ok) {
                alert('Leave request submitted successfully!');
                setShowLeaveModal(false);
                setLeaveData({ startDate: '', endDate: '', reason: '', type: 'Casual' });
                // Refresh leaves list
                const refreshed = await fetch(`http://localhost:5000/api/leaves?employeeId=${encodeURIComponent(employeeData.employeeId)}`);
                if (refreshed.ok) setMyLeaves(await refreshed.json());
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.message || 'Failed to submit request'}`);
            }
        } catch (err) {
            console.error('Leave submission error:', err);
            alert('Network error. Please try again.');
        }
    };

    const handleLeaveDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this leave request?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/leaves/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setMyLeaves(prev => prev.filter(l => l._id !== id));
            } else {
                alert('Failed to delete leave request');
            }
        } catch (err) {
            console.error('Delete leave error:', err);
        }
    };

    // Track if we're returning from Messages to prevent premature logout
    useEffect(() => {
        // Scroll to top when component mounts/changes
        window.scrollTo(0, 0);
    }, [viewMode]);

    // If user uses browser navigation (back/forward), force logout for safety
    useEffect(() => {
        // Only apply popstate logout if user is NOT on the Messages page
        if (viewMode === 'overview') {
            const handlePop = () => {
                try {
                    logout();
                } finally {
                    navigate('/login');
                }
            };

            window.addEventListener('popstate', handlePop);
            return () => window.removeEventListener('popstate', handlePop);
        }
    }, [logout, navigate, viewMode]);

    if (loading && !employeeData) return <div style={{ padding: '40px' }}>Loading your dashboard...</div>;



    return (
        <div className="employee-card">
            <div className="container">
                <div className="dashboard-header no-print">
                    <div>
                        <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '5px' }}>My Portfolio</h1>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Welcome, {employeeData?.fullName || user?.email}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div className="fly-card" style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px 20px', borderRadius: '50px' }}>
                            <button onClick={handlePrev} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--primary)' }}>◀</button>

                            <select
                                value={month}
                                onChange={(e) => setViewDate(new Date(year, parseInt(e.target.value), 1))}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    fontWeight: 800,
                                    fontSize: '0.95rem',
                                    color: 'var(--text-main)',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    appearance: 'none',
                                    textAlign: 'center'
                                }}
                            >
                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
                                    <option key={m} value={i}>{m}</option>
                                ))}
                            </select>

                            <select
                                value={year}
                                onChange={(e) => setViewDate(new Date(parseInt(e.target.value), month, 1))}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    fontWeight: 800,
                                    fontSize: '0.95rem',
                                    color: 'var(--text-main)',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    paddingLeft: '5px'
                                }}
                            >
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>

                            <button onClick={handleNext} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--primary)' }}>▶</button>
                        </div>
                        <Button
                            onClick={() => navigate('/profile')}
                            className="btn-profile"
                        >
                            👤 My Profile
                        </Button>
                        {viewMode === 'overview' && (
                            <Button
                                onClick={() => setSearchParams({ v: 'slip' })}
                                className="btn-payslip"
                                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
                            >
                                📄 Salary Slip
                            </Button>
                        )}
                        <Button
                            onClick={() => navigate('/messages')}
                            className="btn-message"
                        >
                            💬 Messages
                        </Button>
                        <Button
                            onClick={() => setShowLeaveModal(true)}
                            className="btn-leave"
                            style={{
                                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                color: 'white',
                                padding: '0.4rem 0.8rem',
                                fontSize: '0.8rem'
                            }}
                        >
                            📅 Request Leave
                        </Button>
                        <Button
                            className="logout-btn"
                            onClick={() => { logout(); navigate('/login'); }}
                            variant="secondary"
                            style={{
                                padding: '0.6rem 1.8rem',
                                fontSize: '0.95rem',
                                fontWeight: '700',
                                borderRadius: '50px',
                                background: '#fff'
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Leave Modal */}
                {showLeaveModal && createPortal(
                    <div className="modal-overlay">
                        <div className="message-form-card fade-in" style={{ position: 'relative', zIndex: 1001, width: '90%', maxWidth: '500px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <h3 className="title-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>📅 Request Leave</h3>
                                <button onClick={() => setShowLeaveModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
                            </div>

                            <form onSubmit={handleLeaveSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label className="form-label">Leave Type</label>
                                    <select
                                        value={leaveData.type}
                                        onChange={(e) => setLeaveData({ ...leaveData, type: e.target.value })}
                                        className="form-select"
                                        required
                                    >
                                        <option value="Casual">Casual Leave</option>
                                        <option value="Sick">Sick Leave</option>
                                        <option value="Earned">Earned Leave</option>
                                        <option value="Loss of Pay (LOP)">Loss of Pay (LOP)</option>
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                    <div>
                                        <label className="form-label">From</label>
                                        <input
                                            type="date"
                                            value={leaveData.startDate}
                                            onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">To</label>
                                        <input
                                            type="date"
                                            value={leaveData.endDate}
                                            onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '25px' }}>
                                    <label className="form-label">Reason</label>
                                    <textarea
                                        value={leaveData.reason}
                                        onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                                        className="form-textarea"
                                        rows="3"
                                        required
                                        placeholder="Brief reason for leave..."
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <Button type="button" variant="secondary" onClick={() => setShowLeaveModal(false)}>Cancel</Button>
                                    <Button type="submit" variant="primary">Submit Request</Button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}

                {viewMode === 'slip' && (
                    <div style={{ marginTop: '30px' }}>
                        <SalarySlip
                            employee={employeeData}
                            payrollData={payslipData?.earnings ? { ...payslipData.earnings, tax: payslipData.deductions?.taxPercent, pf: payslipData.deductions?.pf } : employeeData?.payroll}
                            stats={stats}
                            onBack={() => setSearchParams({ v: 'overview' })}
                        />
                    </div>
                )}

                {viewMode === 'overview' && (
                    <>
                    <Button
  onClick={markAttendance}
  disabled={!canMarkAttendance}
  style={{
    background: canMarkAttendance
      ? 'linear-gradient(135deg, #22c55e, #16a34a)'
      : '#9ca3af',
    color: 'white',
    cursor: canMarkAttendance ? 'pointer' : 'not-allowed'
  }}
>
  🕘 Mark Attendance
</Button>

<p style={{ fontSize: '0.8rem', color: '#ef4444' }}>
  {locationMsg}
</p>


<p style={{ fontSize: '0.8rem', color: '#ef4444' }}>
  {locationMsg}
</p>

                        <div className="fly-card" style={{ marginBottom: '30px', padding: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.8rem', fontWeight: '800' }}>Financial Insights</h2>
                                <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '700', background: 'var(--secondary)', padding: '6px 16px', borderRadius: '50px' }}>
                                    Attendance: {stats.present} / {stats.totalDays} Days
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                                <div style={{
                                    padding: '30px',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)',
                                    borderRadius: 'var(--radius)',
                                    color: 'white',
                                    boxShadow: 'var(--shadow-lg)'
                                }}>
                                    <h3 style={{ fontSize: '0.9rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '800' }}>Net Earnings</h3>
                                    <p style={{ fontSize: '3.5rem', fontWeight: '900', marginTop: '15px', letterSpacing: '-1px' }}>₹{payrollResults.netPayable.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                    <span style={{
                                        display: 'inline-block',
                                        marginTop: '10px',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontSize: '0.8rem',
                                        fontWeight: '600'
                                    }}>Based on current attendance</span>
                                </div>

                                <div style={{
                                    padding: '30px',
                                    background: '#fff',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border-color)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Gross Salary (Full)</h3>
                                    <p style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '10px' }}>₹{payrollResults.gross.toLocaleString()}</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '15px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Basic: ₹{payrollResults.breakdown.basic || 0}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HRA: ₹{payrollResults.breakdown.h || 0}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spl: ₹{payrollResults.breakdown.spl || 0}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Travel: ₹{payrollResults.breakdown.travel || 0}</div>
                                    </div>
                                </div>

                                <div style={{
                                    padding: '30px',
                                    background: '#fff',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border-color)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Total Deductions</h3>
                                    <p style={{ fontSize: '3rem', fontWeight: '700', color: '#ef4444', marginTop: '10px' }}>₹{payrollResults.deductions.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                    <div style={{ marginTop: '15px' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tax ({payrollResults.taxRate}%): ₹{payrollResults.tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PF Contribution: ₹{payrollResults.pf.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Leave Balance Summary */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                            {[
                                { label: 'Casual', key: 'casual', icon: '🏝️', color: '#f59e0b', bg: '#fffbeb' },
                                { label: 'Sick', key: 'sick', icon: '🤒', color: '#dc2626', bg: '#fef2f2' },
                                { label: 'Earned', key: 'earned', icon: '💼', color: '#0284c7', bg: '#f0f9ff' }
                            ].map(item => (
                                <div key={item.key} className="fly-card" style={{
                                    padding: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    background: 'white',
                                    borderLeft: `5px solid ${item.color}`,
                                    borderRadius: '16px'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: item.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem'
                                    }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>{item.label}</p>
                                        <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                            {employeeData.leaveBalances ? employeeData.leaveBalances[item.key] : 0} <span style={{ fontSize: '0.7rem', fontWeight: '500', color: '#94a3b8' }}>DAYS</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Attendance Summary Bar */}
                        <div className="glass-panel" style={{ padding: '20px' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Monthly Attendance Record</h3>

                            {/* Days Header */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '8px' }}>
                                {weekdayShort.map(w => (
                                    <div key={w} style={{ textAlign: 'center', fontWeight: 700, padding: '4px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{w}</div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                                {(() => {
                                    const firstWeekday = new Date(year, month, 1).getDay();
                                    const gridCells = [];

                                    // Empty cells for offset
                                    for (let i = 0; i < firstWeekday; i++) {
                                        gridCells.push(<div key={`empty-${i}`} />);
                                    }

                                    // Day cells
                                    for (let d = 1; d <= stats.totalDays; d++) {
                                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                        const status = attendance[dateStr];
                                        const dateObj = new Date(year, month, d);
                                        const dayName = weekdayShort[dateObj.getDay()];

                                        let bg = 'transparent';
                                        let borderTop = '1px solid var(--border-color)';

                                        if (status === 'P') {
                                            bg = '#dcfce7'; // Light green
                                            borderTop = '3px solid #16a34a';
                                        } else if (status === 'A') {
                                            bg = '#fee2e2'; // Light red
                                            borderTop = '3px solid #ef4444';
                                        } else if (status === 'L') {
                                            bg = '#ffedd5'; // Light orange
                                            borderTop = '3px solid #f97316';
                                        }

                                        gridCells.push(
                                            <div key={d} style={{
                                                border: '1px solid var(--border-color)',
                                                borderTop: borderTop,
                                                borderRadius: '8px',
                                                padding: '8px',
                                                minHeight: '60px',
                                                background: status ? (status === 'P' ? '#fff' : bg) : 'transparent',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative'
                                            }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{d}</span>
                                                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '2px' }}>{dayName}</span>
                                                {status && (
                                                    <div style={{
                                                        marginTop: '4px',
                                                        fontSize: '0.6rem',
                                                        fontWeight: '800',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        background: status === 'P' ? '#16a34a' : (status === 'A' ? '#ef4444' : '#f97316'),
                                                        color: 'white'
                                                    }}>
                                                        {status === 'P' ? 'PRESENT' : (status === 'A' ? 'ABSENT' : 'LEAVE')}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                    return gridCells;
                                })()}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', background: '#16a34a', borderRadius: '50%' }}></span> Present ({stats.present})</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', background: '#f97316', borderRadius: '50%' }}></span> Leave ({stats.leave})</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%' }}></span> Absent ({stats.absent})</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', background: '#e2e8f0', borderRadius: '50%' }}></span> Unmarked</span>
                            </div>
                        </div>

                        {/* Leave History Section */}
                        <div className="history-section" style={{ marginTop: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                <div>
                                    <h2 className="title-gradient" style={{ margin: 0, fontSize: '1.8rem' }}>📤 Leave Portfolio</h2>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>Your time-off journey</p>
                                </div>
                                <div className="filter-btn active" style={{ cursor: 'default' }}>
                                    {myLeaves.length} Total
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '20px' }}>
                                {myLeaves.length === 0 ? (
                                    <div className="message-card" style={{ textAlign: 'center', padding: '40px' }}>
                                        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>🌈</span>
                                        <p style={{ color: 'var(--text-muted)', margin: 0, fontWeight: '600' }}>No leave history yet. Ready for a break?</p>
                                    </div>
                                ) : (
                                    myLeaves.map(leave => {
                                        const typeIcon = leave.type === 'Casual' ? '🏝️' : (leave.type === 'Sick' ? '🤒' : (leave.type === 'Earned' ? '💼' : '💸'));
                                        const statusClass = leave.status === 'Approved' ? 'solved' : (leave.status === 'Rejected' ? 'new' : 'open');

                                        return (
                                            <div key={leave._id} className={`message-card ${leave.status === 'Pending' ? 'unread' : ''}`}>
                                                <div className="message-header">
                                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                                        <div style={{ fontSize: '1.8rem', background: '#f8fafc', width: '55px', height: '55px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                                            {typeIcon}
                                                        </div>
                                                        <div>
                                                            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: '800' }}>{leave.type} Leave</h3>
                                                            <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                                {leave.startDate} ➝ {leave.endDate}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                                        <span className={`status-badge status-${statusClass}`}>
                                                            {leave.status}
                                                        </span>
                                                        {leave.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleLeaveDelete(leave._id)}
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    color: '#ef4444',
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: '700',
                                                                    cursor: 'pointer',
                                                                    padding: '4px 8px',
                                                                    borderRadius: '6px',
                                                                    transition: 'all 0.2s',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px'
                                                                }}
                                                                onMouseOver={(e) => e.target.style.background = '#fee2e2'}
                                                                onMouseOut={(e) => e.target.style.background = 'none'}
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="response-container" style={{ marginTop: '15px', background: 'rgba(248, 250, 252, 0.5)' }}>
                                                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: '1.6' }}>
                                                        <span style={{ color: '#94a3b8', fontWeight: '700' }}>Reason: </span>
                                                        {leave.reason}
                                                    </p>
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '12px', fontWeight: '600' }}>
                                                    Requested on {new Date(leave.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EmployeeDashboard;
