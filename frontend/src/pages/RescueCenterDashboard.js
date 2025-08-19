import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RescueCenterDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [cats, setCats] = useState([]);
  const [newCat, setNewCat] = useState({
    name: '',
    age: '',
    healthStatus: '',
    location: '',
    specialNeeds: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch cats belonging to rescue center user
  useEffect(() => {
    if (!auth.token) return;

    fetch('http://localhost:5000/api/cats/my-cats', {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
      .then(res => res.json())
      .then(setCats)
      .catch(err => console.error('Failed to fetch cats:', err));
  }, [auth.token]);

  // Handle form input changes
  const handleChange = e => {
    setNewCat({
      ...newCat,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission to add a new cat
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/cats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify(newCat)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to add cat');
      }
      const addedCat = await res.json();
      // Append the new cat to cats list
      setCats([...cats, addedCat]);
      // Reset the form
      setNewCat({
        name: '',
        age: '',
        healthStatus: '',
        location: '',
        specialNeeds: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Rescue Center Dashboard</h2>

      <h3>Add New Cat</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newCat.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={newCat.age}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="healthStatus"
          placeholder="Health Status"
          value={newCat.healthStatus}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newCat.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="specialNeeds"
          placeholder="Special Needs"
          value={newCat.specialNeeds}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Cat'}
        </button>
      </form>

      <h3>Your Cats</h3>
      <ul>
        {cats.length === 0 && <li>No cats added yet.</li>}
        {cats.map(cat => (
          <li key={cat._id}>
            {cat.name} - Age: {cat.age} - Health: {cat.healthStatus}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RescueCenterDashboard;
