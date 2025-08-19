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

export default AdminDashboard;
