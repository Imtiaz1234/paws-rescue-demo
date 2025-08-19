import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
    rescueCenterName: '',
    location: '',
    documentUrl: ''
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      login(data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
      <div>
        <label>
          <input type="radio" name="role" value="User" checked={formData.role === 'User'} onChange={handleChange} />
          Adopter
        </label>
        <label>
          <input type="radio" name="role" value="Rescue" checked={formData.role === 'Rescue'} onChange={handleChange} />
          Rescue Center
        </label>
      </div>
      {formData.role === 'Rescue' && (
        <>
          <input name="rescueCenterName" value={formData.rescueCenterName} onChange={handleChange} placeholder="Rescue Center Name" required />
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
          <input name="documentUrl" value={formData.documentUrl} onChange={handleChange} placeholder="Document URL (optional)" />
        </>
      )}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;

