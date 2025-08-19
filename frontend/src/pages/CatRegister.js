import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const CatRegister = () => {
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    healthStatus: '',
    images: '',
    location: '',
    specialNeeds: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!auth.token || (auth.user.role !== 'Admin' && auth.user.role !== 'Rescue')) {
    return <div>Access denied: Only admins or rescues can add cats.</div>;
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      const images = formData.images.split(',').map(i => i.trim()).filter(i => i);
      
      const res = await fetch('http://localhost:5000/api/cats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({ 
          ...formData, 
          images,
          age: parseInt(formData.age) 
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add cat');
      
      setMessage('Cat added successfully!');
      setFormData({ 
        name: '', 
        age: '', 
        gender: '', 
        healthStatus: '', 
        images: '', 
        location: '', 
        specialNeeds: '' 
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <h2>Add a Cat to Your Shelter</h2>
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Cat Name" required />
        
        <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Age" required />
        
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Unknown">Unknown</option>
        </select>
        
        <input name="healthStatus" value={formData.healthStatus} onChange={handleChange} placeholder="Health Status" required />
        
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
        
        <input name="images" value={formData.images} onChange={handleChange} placeholder="Image URLs (comma separated)" />
        
        <input name="specialNeeds" value={formData.specialNeeds} onChange={handleChange} placeholder="Special Needs" />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Adding Cat...' : 'Add Cat'}
        </button>
      </form>
    </div>
  );
};

export default CatRegister;