import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const MessageForm = ({ employee, onMessageSent }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('query');
    const [sending, setSending] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const payload = {
                fromRole: 'employee',
                fromId: user?.employeeId || user?.email,
                fromName: employee?.fullName || user?.email,
                toRole: 'admin',
                toId: 'admin',
                title,
                message,
                category,
                status: 'open'
            };

            const res = await fetch('http://192.168.1.7:5001/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to send message');

            setSuccessMsg('✅ Message sent successfully!');
            setTitle('');
            setMessage('');
            setCategory('query');

            if (onMessageSent) onMessageSent();

            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setErrorMsg('❌ Error sending message: ' + err.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="message-form-card fade-in">
            <h2 style={{ color: 'var(--primary)', marginBottom: '25px', fontSize: '1.6rem', textAlign: 'center' }}>📝 Send Query to Admin</h2>

            {successMsg && (
                <div style={{
                    background: '#ecfdf5',
                    color: '#047857',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    border: '1px solid #6ee7b7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: '600'
                }}>
                    <span>✅</span> {successMsg}
                </div>
            )}

            {errorMsg && (
                <div style={{
                    background: '#fef2f2',
                    color: '#b91c1c',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    border: '1px solid #fecaca'
                }}>
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Brief subject of your query"
                        required
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label className="form-label">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="form-select"
                    >
                        <option value="query">❓ General Query</option>
                        <option value="error">⚠️ Error/Issue</option>
                        <option value="feedback">💡 Feedback</option>
                        <option value="other">📝 Other</option>
                    </select>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label className="form-label">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="form-textarea text-area-resize"
                        placeholder="Describe your query or issue in detail..."
                        required
                        rows="6"
                    />
                </div>

                <button
                    type="submit"
                    disabled={sending}
                    className={`btn-modern btn-message w-full ${sending ? 'opacity-50' : ''}`}
                    style={{ fontSize: '1.1rem' }}
                >
                    {sending ? '⏳ Sending...' : '📤 Send Message'}
                </button>
            </form>
        </div>
    );
};

export default MessageForm;
