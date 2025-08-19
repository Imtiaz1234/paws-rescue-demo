/*
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
*/



import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RescueCenterDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [cats, setCats] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.token) {
      fetchMyCats();
    }
  }, [auth.token]);

  const fetchMyCats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cats/my-cats', {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      const data = await res.json();
      setCats(data);
    } catch (error) {
      console.error('Failed to fetch cats:', error);
    }
  };

  const deleteCat = async (catId) => {
    if (!window.confirm('Are you sure you want to delete this cat?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/cats/${catId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      
      if (res.ok) {
        setCats(cats.filter(cat => cat._id !== catId));
      }
    } catch (error) {
      console.error('Failed to delete cat:', error);
    }
  };

  if (!auth.token || auth.user.role !== 'Rescue') {
    return <div>Access denied. Only rescue centers can access this page.</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Rescue Center Dashboard</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {showAddForm ? 'Cancel' : 'Add New Cat'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Add New Cat</h3>
          {/* You can either embed the form here or link to CatRegister page */}
          <p>
            <a href="/cat-register" style={{ color: '#3182ce', textDecoration: 'underline' }}>
              Go to Cat Registration Form
            </a>
          </p>
        </div>
      )}

      <h2>Your Cats</h2>
      {cats.length === 0 ? (
        <p>No cats added yet. Add your first cat!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {cats.map(cat => (
            <div key={cat._id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
              {cat.images && cat.images.length > 0 && (
                <img 
                  src={cat.images[0]} 
                  alt={cat.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
                />
              )}
              <h3>{cat.name}</h3>
              <p>Age: {cat.age}</p>
              <p>Gender: {cat.gender || 'Unknown'}</p>
              <p>Health: {cat.healthStatus}</p>
              <p>Status: {cat.adoptionStatus}</p>
              <button 
                onClick={() => deleteCat(cat._id)}
                style={{ 
                  padding: '0.3rem 0.8rem', 
                  backgroundColor: '#e53e3e', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  marginTop: '0.5rem'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RescueCenterDashboard;