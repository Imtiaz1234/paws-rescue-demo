
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  // Remove adoption application
  const handleRemoveApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to remove this adoption application?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/adoptions/${appId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      if (res.ok) {
        setApplications(prev => prev.filter(app => app._id !== appId));
      } else {
        const error = await res.json();
        alert(`Failed to remove application: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error removing application:', error);
      alert('An unexpected error occurred while removing the application.');
    }
  };
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [rescues, setRescues] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!auth.token) return;

    // Fetch the users
    fetch('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));

    // Fetch the rescue centers
    fetch('http://localhost:5000/api/admin/rescue-centers', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
      .then(res => res.json())
      .then(data => setRescues(data))
      .catch(err => console.error('Error fetching rescues:', err));

    // Fetch adoption applications
    fetch('http://localhost:5000/api/admin/adoptions', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error('Error fetching adoption applications:', err));
  }, [auth.token]);

  // Delete user function when "Flag User" is pressed
  const handleFlagUser = async (userId) => {
    if (!window.confirm('Are you sure you want to flag (delete) this user?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      if (res.ok) {
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      } else {
        const error = await res.json();
        alert(`Failed to delete user: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An unexpected error occurred while flagging the user.');
    }
  };

  // Verify a rescue center
  const handleVerifyRescue = async (rescueId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/verify-rescue/${rescueId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      if (res.ok) {
        const updated = await res.json();
        setRescues(prev => prev.map(r => r._id === rescueId ? updated : r));
      } else {
        alert('Failed to verify rescue center');
      }
    } catch (error) {
      console.error('Error verifying rescue:', error);
      alert('An error occurred during verifying.');
    }
  };

  // Flag fraud rescue acts as unverify
  const handleFlagFraudRescue = async (rescueId) => {
    if (!window.confirm('Flagging as fraud will unverify this rescue center. Proceed?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/unverify-rescue/${rescueId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      if (res.ok) {
        const updated = await res.json();
        setRescues(prev => prev.map(r => r._id === rescueId ? updated : r));
      } else {
        alert('Failed to flag rescue center as fraud');
      }
    } catch (error) {
      console.error('Error flagging fraud rescue:', error);
      alert('An error occurred during flagging fraud.');
    }
  };

  if (!auth.user || auth.user.role !== 'Admin') {
    return <div>Access Denied</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '1rem' }}>
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Users</h3>
        <ul>
          {users.map(user => (
            <li key={user._id} style={{ marginBottom: 12 }}>
              {user.name} ({user.email}) — Role: {user.role}
              {' '}
              <button 
                onClick={() => handleFlagUser(user._id)} 
                style={{ marginLeft: '1rem', color: 'red' }}
              >
                Flag User
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Rescue Centers</h3>
        <ul>
          {rescues.map(rescue => (
            <li key={rescue._id} style={{ marginBottom: 12 }}>
              {rescue.name} — Verified: {rescue.verified ? 'Yes' : 'No'}
              {' '}
              {rescue.verified ? (
                <button 
                  onClick={() => handleFlagFraudRescue(rescue._id)} 
                  style={{ marginLeft: '1rem', color: 'red' }}
                >
                  Flag Fraud
                </button>
              ) : (
                <button 
                  onClick={() => handleVerifyRescue(rescue._id)} 
                  style={{ marginLeft: '1rem' }}
                >
                  Verify
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Adoption Applications</h3>
        {applications.length === 0 ? (
          <p>No adoption applications submitted yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Applicant Name</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Applicant Email</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Cat Name</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Contact Details</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Home Check Passed</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{app.user?.name || 'N/A'}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{app.user?.email || 'N/A'}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{app.cat?.name || 'N/A'}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{app.contactDetails || 'N/A'}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{app.homeCheckPassed ? 'Yes' : 'No'}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{app.status}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{new Date(app.submittedAt).toLocaleString()}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    <button onClick={() => handleRemoveApplication(app._id)} style={{ color: 'red' }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
