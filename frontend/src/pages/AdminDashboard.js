/*
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [rescues, setRescues] = useState([]);

  useEffect(() => {
    if (!auth.token) return;

    // Fetch users
    fetch('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
      .then(res => res.json())
      .then(setUsers);

    // Fetch rescue centers
    fetch('http://localhost:5000/api/admin/rescue-centers', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
      .then(res => res.json())
      .then(setRescues);
  }, [auth.token]);

  if (!auth.user || auth.user.role !== 'Admin') return <div>Access Denied</div>;

  // Handler to verify rescue center
  const handleVerify = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/verify-rescue/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      if (res.ok) {
        const updatedRescue = await res.json();
        setRescues(prev =>
          prev.map(r => r._id.toString() === id.toString() ? { ...updatedRescue } : r)
        );
      } else {
        console.error('Failed to verify rescue center');
      }
    } catch (err) {
      console.error('Error verifying rescue center:', err);
    }
  };

  // Handler to unverify rescue center
  const handleUnverify = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/admin/unverify-rescue/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` }
    });

    console.log('API response status:', res.status);

    if (res.ok) {
      const updatedRescue = await res.json();
      console.log('Updated rescue from API:', updatedRescue);

      setRescues(prev =>
        prev.map(r => r._id.toString() === id.toString() ? { ...updatedRescue } : r)
      );
    } else {
      console.error('Failed to unverify rescue center');
    }
  } catch (err) {
    console.error('Error unverifying rescue center:', err);
  }
};


  return (
    <div>
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Users</h3>
        <ul>
          {users.map(u => (
            <li key={u._id}>
              {u.name} ({u.email}) - Role: {u.role}
            </li>
          ))}
        </ul>
      </section>

      <section>
  <h3>Rescue Centers</h3>
  <ul>
    {rescues.map(r => (
      <li key={r._id}>
        {r.name} - Verified: {r.verified ? 'Yes' : 'No'}
        {r.verified ? (
          <button onClick={() => handleUnverify(r._id)} style={{ marginLeft: '10px' }}>
            Unverify
          </button>
        ) : (
          <button onClick={() => handleVerify(r._id)} style={{ marginLeft: '10px' }}>
            Verify
          </button>
        )}
      </li>
    ))}
  </ul>
</section>

    </div>
  );
};
*/

// src/pages/AdminDashboard.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [rescues, setRescues] = useState([]);

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
    </div>
  );
};

export default AdminDashboard;


