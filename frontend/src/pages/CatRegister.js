import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const CatRegister = () => {
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    healthStatus: '',
    images: '',
    location: '',
    specialNeeds: ''
  });
  const [message, setMessage] = useState('');

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
    try {
      const images = formData.images.split(',').map(i => i.trim());
      const res = await fetch('http://localhost:5000/api/cats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({ ...formData, images })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add cat');
      setMessage('Cat added successfully!');
      setFormData({ name: '', age: '', healthStatus: '', images: '', location: '', specialNeeds: '' });
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a Cat</h2>
      {message && <p>{message}</p>}
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
      <input name="age" value={formData.age} onChange={handleChange} placeholder="Age" type="number" required />
      <input name="healthStatus" value={formData.healthStatus} onChange={handleChange} placeholder="Health Status" required />
      <input name="images" value={formData.images} onChange={handleChange} placeholder="Image URLs (comma separated)" />
      <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
      <input name="specialNeeds" value={formData.specialNeeds} onChange={handleChange} placeholder="Special Needs" />
      <button type="submit">Add Cat</button>
    </form>
  );
};

export default CatRegister;
