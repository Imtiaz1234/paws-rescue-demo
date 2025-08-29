

import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const DonationLog = ({ logs, onNoteEdit }) => {
  const { auth } = useContext(AuthContext);
  const isAdmin = auth.user?.role === 'Admin';
  const { darkMode } = useContext(ThemeContext);
  const [editIdx, setEditIdx] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleEdit = (idx, note) => {
    setEditIdx(idx);
    setEditNote(note || '');
  };

  const handleSave = async (donationId) => {
    setSaving(true);
    try {
      await onNoteEdit(donationId, editNote);
      setEditIdx(null);
    } catch {
      alert('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="donation-log"
      style={{
        background: darkMode ? '#23272f' : 'white',
        color: darkMode ? '#f1f1f1' : '#222',
        borderRadius: 12,
        boxShadow: darkMode
          ? '0 2px 8px rgba(0,0,0,0.5)'
          : '0 2px 8px rgba(0,0,0,0.1)',
        padding: '2rem',
        marginBottom: '2rem',
      }}
    >
      <h2>Donation Transparency Log</h2>
      <ul>
        {logs.map((log, idx) => (
          <li key={log._id || idx}>
            <strong>${log.amount}</strong> for {log.purpose}{' '}
            <span style={{ color: darkMode ? '#b0b0b0' : '#888' }}>({new Date(log.date).toLocaleDateString()})</span>
            {isAdmin && log.donor && (
              <span style={{ marginLeft: 8, color: '#0077cc' }}>
                Donor: {log.donor.name || log.donor}
              </span>
            )}
            {isAdmin && editIdx === idx ? (
              <div>
                <textarea
                  value={editNote}
                  onChange={e => setEditNote(e.target.value)}
                  rows={2}
                  style={{ width: '100%', background: darkMode ? '#181a20' : '#fff', color: darkMode ? '#f1f1f1' : '#222' }}
                  disabled={saving}
                />
                <button onClick={() => handleSave(log._id)} disabled={saving} style={{ marginRight: 8 }}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditIdx(null)} disabled={saving}>Cancel</button>
              </div>
            ) : (
              log.note && <div style={{ fontStyle: 'italic', color: darkMode ? '#b0b0b0' : '#555' }}>Note: {log.note}</div>
            )}
            {isAdmin && editIdx !== idx && (
              <button style={{ marginTop: 4 }} onClick={() => handleEdit(idx, log.note)}>
                {log.note ? 'Edit Note' : 'Add Note'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationLog;
