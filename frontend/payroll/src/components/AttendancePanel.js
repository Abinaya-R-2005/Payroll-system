import React, { useState, useEffect, useMemo } from "react";

const weekdayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

<<<<<<< HEAD
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
=======
const AttendancePanel = ({ employee, onMarkAttendance, onMonthChange, initialStatuses = {} }) => {
    const [viewDate, setViewDate] = useState(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });
    const [isEditMode, setIsEditMode] = useState(false);

    // statuses: { 'YYYY-MM-DD': 'P'|'A'|'L' }
    const [statuses, setStatuses] = useState({});

    const initialStatusesKey = useMemo(() => JSON.stringify(initialStatuses || {}), [initialStatuses]);

    useEffect(() => {
        if (initialStatuses && Object.keys(initialStatuses).length > 0) {
            setStatuses(initialStatuses);
        } else {
            setStatuses({});
        }
    }, [employee?.employeeId, initialStatusesKey, initialStatuses]);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    useEffect(() => {
        if (onMonthChange) {
            const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
            onMonthChange(monthStr);
        }
    }, [year, month, onMonthChange]);

    const daysInMonth = useMemo(() => {
        return new Date(year, month + 1, 0).getDate();
    }, [year, month]);

    if (!employee) return null;

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
>>>>>>> 49c83d320a8f36a456d2c9f3e5510e8f2d6d0391

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

  /* ---------- NOTIFY PARENT ---------- */
  useEffect(() => {
    onMonthChange?.(
      `${year}-${String(month + 1).padStart(2, "0")}`
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
