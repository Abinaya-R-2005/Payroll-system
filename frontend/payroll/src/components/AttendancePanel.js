import React, { useState, useEffect, useMemo } from "react";

const weekdayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_COLOR = {
  P: "#16a34a",
  L: "#f97316",
  A: "#ef4444"
};

const AttendancePanel = ({
  employee,
  onMarkAttendance,
  onMonthChange,
  initialStatuses = {},
  role = "admin"
}) => {
  const today = new Date();

  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [statuses, setStatuses] = useState({});

  /* ---------- SYNC ATTENDANCE DATA ---------- */
  useEffect(() => {
    setStatuses(initialStatuses || {});
  }, [initialStatuses, employee?.employeeId]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  /* ---------- CURRENT MONTH CHECK ---------- */
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  const isEditable = role === "admin" && isCurrentMonth;

<<<<<<< HEAD
  /* ---------- NOTIFY PARENT ---------- */
  useEffect(() => {
    onMonthChange?.(
      `${year}-${String(month + 1).padStart(2, "0")}`
=======
    const handlePrev = () => {
        const d = new Date(year, month - 1, 1);
        setViewDate(d);
        onMonthChange?.(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    };

    const handleNext = () => {
        const d = new Date(year, month + 1, 1);
        setViewDate(d);
        onMonthChange?.(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    };

    const handleMonthChange = (e) => {
        const newMonth = parseInt(e.target.value);
        setViewDate(new Date(year, newMonth, 1));
    };

    const handleYearChange = (e) => {
        const newYear = parseInt(e.target.value);
        setViewDate(new Date(newYear, month, 1));
    };

    const toggleStatus = (dateStr, value) => {
        if (!isEditMode) return;
        setStatuses(prev => {
            const next = { ...prev, [dateStr]: value };
            return next;
        });
        onMarkAttendance(employee.employeeId, dateStr, value);
    };

    const getStatusStyle = (val) => {
        if (val === 'P') return { background: '#16a34a', color: 'white', label: 'Present' };
        if (val === 'L') return { background: '#f97316', color: 'white', label: 'Leave' };
        if (val === 'A') return { background: '#ef4444', color: 'white', label: 'Absent' };
        return { background: 'transparent', color: 'var(--text-muted)', label: 'N/A' };
    };

    const getSmallButtonStyle = (active, value) => {
        const base = {
            padding: '4px 6px',
            borderRadius: '4px',
            border: '1px solid transparent',
            cursor: 'pointer',
            fontSize: '0.75rem',
            minWidth: '24px',
            textAlign: 'center',
            transition: 'all 0.2s',
            flex: '1'
        };

        if (!active) return { ...base, background: '#f3f4f6', color: 'var(--text-muted)' };

        const style = getStatusStyle(value);
        return { ...base, background: style.background, color: style.color, borderColor: style.background };
    };

    const firstWeekday = new Date(year, month, 1).getDay();
    const totalCells = firstWeekday + daysInMonth;
    const weeks = Math.ceil(totalCells / 7);

    const cells = new Array(weeks * 7).fill(null).map((_, idx) => {
        const dayNumber = idx - firstWeekday + 1;
        if (dayNumber < 1 || dayNumber > daysInMonth) return null;
        const dateObj = new Date(year, month, dayNumber);
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
        return { day: dayNumber, dateStr, weekday: weekdayShort[dateObj.getDay()] };
    });

    const years = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 5; y <= currentYear + 5; y++) {
        years.push(y);
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div style={{
            background: '#fff',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-color)',
            padding: '16px',
            marginTop: '25px',
            boxShadow: 'var(--shadow-lg)',
            transition: 'all 0.3s',
            maxWidth: '100%',
            overflowX: 'hidden'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                    <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.1rem' }}>Attendance — {employee.fullName || employee.email}</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Month/Year selection</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: isEditMode ? 'var(--primary)' : '#f3f4f6',
                            color: isEditMode ? 'white' : 'var(--text-main)',
                            border: '1px solid ' + (isEditMode ? 'var(--primary)' : 'var(--border-color)'),
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <span>{isEditMode ? '🔓 Editing' : '🔒 View Only'}</span>
                    </button>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center', background: '#f3f4f6', padding: '2px', borderRadius: '8px' }}>
                        <button onClick={handlePrev} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: 'white', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', fontSize: '0.8rem' }}>◀</button>
                        <select value={month} onChange={handleMonthChange} style={{ border: 'none', background: 'transparent', fontWeight: 600, padding: '0 4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                            {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
                        </select>
                        <select value={year} onChange={handleYearChange} style={{ border: 'none', background: 'transparent', fontWeight: 600, padding: '0 4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <button onClick={handleNext} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: 'white', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', fontSize: '0.8rem' }}>▶</button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                {weekdayShort.map(w => (
                    <div key={w} style={{ textAlign: 'center', fontWeight: 700, padding: '4px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{w}</div>
                ))}

                {cells.map((cell, i) => {
                    const status = cell ? statuses[cell.dateStr] : null;
                    const statusInfo = getStatusStyle(status);
                    return (
                        <div key={i} style={{
                            border: '1px solid var(--border-color)',
                            minHeight: '80px',
                            padding: '6px',
                            borderRadius: '8px',
                            background: cell ? '#fff' : 'transparent',
                            position: 'relative',
                            transition: 'transform 0.2s',
                            boxShadow: cell ? 'var(--shadow-sm)' : 'none',
                            borderTop: (cell && status) ? `3px solid ${statusInfo.background}` : '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: 0
                        }}>
                            {cell ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{cell.day}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{cell.weekday[0]}</div>
                                    </div>

                                    {status && (
                                        <div style={{
                                            fontSize: '0.6rem',
                                            fontWeight: 700,
                                            color: statusInfo.background,
                                            marginBottom: '4px',
                                            textTransform: 'uppercase',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {statusInfo.label}
                                        </div>
                                    )}

                                    {isEditMode ? (
                                        <div style={{ display: 'flex', gap: '3px', marginTop: 'auto', flexWrap: 'wrap' }}>
                                            {['P', 'L', 'A'].map(val => {
                                                const active = statuses[cell.dateStr] === val;
                                                return (
                                                    <button
                                                        key={val}
                                                        title={val === 'P' ? 'Present' : val === 'L' ? 'Leave' : 'Absent'}
                                                        onClick={() => toggleStatus(cell.dateStr, val)}
                                                        style={getSmallButtonStyle(active, val)}
                                                    >
                                                        {val}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        status && (
                                            <div style={{
                                                width: '100%',
                                                height: '4px',
                                                borderRadius: '2px',
                                                background: statusInfo.background,
                                                marginTop: 'auto'
                                            }} />
                                        )
                                    )}
                                </>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            <div style={{
                marginTop: '15px',
                padding: '8px',
                borderRadius: '8px',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                flexWrap: 'wrap',
                gap: '10px'
            }}>
                <div>
                    {!isEditMode ? 'Unlock to mark attendance.' : 'Click P/L/A to record.'}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'block', width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} /> Pres</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'block', width: '6px', height: '6px', borderRadius: '50%', background: '#f97316' }} /> Leave</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ display: 'block', width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} /> Abs</span>
                </div>
            </div>
        </div>
>>>>>>> 98c52ccec9822b7963b1f155ba4fe299e18443e5
    );
  }, [year, month, onMonthChange]);

  /* ---------- NAVIGATION ---------- */
  const handlePrev = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  /* ---------- MARK ATTENDANCE ---------- */
  const markStatus = (dateStr, value) => {
    if (!isEditable) return;

    setStatuses(prev => ({
      ...prev,
      [dateStr]: value
    }));

    onMarkAttendance(employee.employeeId, dateStr, value);
  };

  /* ---------- CALENDAR LOGIC ---------- */
  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [year, month]
  );

  const firstWeekday = new Date(year, month, 1).getDay();
  const totalCells = firstWeekday + daysInMonth;
  const weeks = Math.ceil(totalCells / 7);

  const cells = new Array(weeks * 7).fill(null).map((_, idx) => {
    const dayNumber = idx - firstWeekday + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) return null;

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      dayNumber
    ).padStart(2, "0")}`;

    return { day: dayNumber, dateStr };
  });

  if (!employee) return null;

  /* ---------- UI ---------- */
  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 10 }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
      }}>
        <h3>Attendance — {employee.fullName}</h3>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={handlePrev}>◀</button>
          <strong>
            {viewDate.toLocaleString("default", { month: "long" })} {year}
          </strong>
          <button onClick={handleNext}>▶</button>
        </div>
      </div>

      {/* INFO */}
      <p style={{ fontSize: 12, color: "#555" }}>
        {isEditable
          ? "🟢 Editing enabled (current month)"
          : "🔒 View only (past / future month)"}
      </p>

      {/* CALENDAR */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 6
      }}>
        {weekdayShort.map(d => (
          <strong key={d} style={{ textAlign: "center" }}>{d}</strong>
        ))}

        {cells.map((cell, i) =>
          cell ? (
            <div
              key={i}
              style={{
                border: "1px solid #ddd",
                minHeight: 75,
                padding: 6,
                borderRadius: 6
              }}
            >
              <div style={{ fontWeight: 600 }}>{cell.day}</div>

              {statuses[cell.dateStr] && (
                <div style={{
                  height: 5,
                  background: STATUS_COLOR[statuses[cell.dateStr]],
                  marginTop: 4
                }} />
              )}

              {isEditable && (
                <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                  {["P", "L", "A"].map(s => (
                    <button
                      key={s}
                      onClick={() => markStatus(cell.dateStr, s)}
                      style={{
                        flex: 1,
                        fontSize: 10,
                        background:
                          statuses[cell.dateStr] === s
                            ? STATUS_COLOR[s]
                            : "#eee",
                        color:
                          statuses[cell.dateStr] === s ? "#fff" : "#000"
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div key={i} />
          )
        )}
      </div>
    </div>
  );
};

export default AttendancePanel;
