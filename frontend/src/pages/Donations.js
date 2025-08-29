import React, { useEffect, useState, useContext } from 'react';
import DonationForm from '../components/DonationForm';
import DonationLog from '../components/DonationLog';
import { AuthContext } from '../context/AuthContext';

const Donations = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useContext(AuthContext);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/donations');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDonate = async ({ amount, purpose }) => {
    const res = await fetch('http://localhost:5000/api/donations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {})
      },
      body: JSON.stringify({ amount, purpose })
    });
    if (res.ok) {
      fetchLogs();
    } else {
      throw new Error('Donation failed');
    }
  };

  // Admin note edit handler
  const handleNoteEdit = async (donationId, note) => {
    if (!auth.token) throw new Error('Not authenticated');
    const res = await fetch(`http://localhost:5000/api/donations/${donationId}/note`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`
      },
      body: JSON.stringify({ note })
    });
    if (!res.ok) throw new Error('Failed to update note');
    await fetchLogs();
  };

  return (
    <div className="donations-page">
      <DonationForm onDonate={handleDonate} />
      {loading ? <p>Loading donation logs...</p> : <DonationLog logs={logs} onNoteEdit={handleNoteEdit} />}
    </div>
  );
};

export default Donations;
