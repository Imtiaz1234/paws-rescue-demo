import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RescueAdoptions = () => {
  const { auth } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const removeApplication = async (id) => {
    if (!window.confirm('Are you sure you want to remove this adoption request?')) return;
    setUpdatingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/rescue/rescue-adoptions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      if (!res.ok) throw new Error('Failed to remove application');
      setApplications(prev => prev.filter(app => app._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      if (!auth.token) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/api/rescue/rescue-adoptions', {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        if (!res.ok) throw new Error('Failed to load applications');
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [auth.token]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
  const res = await fetch(`http://localhost:5000/api/rescue/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updatedApp = await res.json();
      setApplications(prev => prev.map(app => (app._id === id ? updatedApp : app)));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!auth.token || auth.user.role !== 'Rescue') {
    return <div>Access denied. Only rescue centers can view this page.</div>;
  }

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (applications.length === 0) return <div>No adoption applications yet.</div>;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem' }}>
      <h2>Adoption Applications</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Cat</th>
            <th>Applicant Name</th>
            <th>Applicant Email</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app._id} style={{ borderBottom: '1px solid #ccc' }}>
              <td>{app.cat?.name || 'N/A'}</td>
              <td>{app.user?.name || 'N/A'}</td>
              <td>{app.user?.email || 'N/A'}</td>
              <td>{app.status}</td>
              <td>
                <button
                  onClick={() => updateStatus(app._id, 'Approved')}
                  disabled={updatingId === app._id || app.status === 'Approved'}
                  style={{ marginRight: 8 }}
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(app._id, 'Rejected')}
                  disabled={updatingId === app._id || app.status === 'Rejected'}
                  style={{ marginRight: 8 }}
                >
                  Reject
                </button>
                <button
                  onClick={() => removeApplication(app._id)}
                  disabled={updatingId === app._id}
                  style={{ color: 'white', background: 'red' }}
                >
                  Remove Request
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RescueAdoptions;
