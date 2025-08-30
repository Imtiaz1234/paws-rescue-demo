import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

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
    let submitData = { ...formData };
    if (formData.role === 'Rescue') {
      submitData.name = formData.rescueCenterName;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
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
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <div className="auth-subtitle">Create your account</div>
        {error && <div className="error-message">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>Registering as</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label>
                <input type="radio" name="role" value="User" checked={formData.role === 'User'} onChange={handleChange} /> Adopter
              </label>
              <label>
                <input type="radio" name="role" value="Rescue" checked={formData.role === 'Rescue'} onChange={handleChange} /> Rescue Center
              </label>
            </div>
          </div>
          {formData.role === 'User' && (
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
              </div>
            </>
          )}
          {formData.role === 'Rescue' && (
            <>
              <div className="form-group">
                <label htmlFor="rescueCenterName">Rescue Center Name</label>
                <input id="rescueCenterName" name="rescueCenterName" value={formData.rescueCenterName} onChange={handleChange} placeholder="Rescue Center Name" required />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
              </div>
              <div className="form-group">
                <label htmlFor="documentUrl">Document URL (optional)</label>
                <input id="documentUrl" name="documentUrl" value={formData.documentUrl} onChange={handleChange} placeholder="Document URL (optional)" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
              </div>
            </>
          )}
          <button className="auth-button" type="submit">Register</button>
        </form>
        <div className="auth-footer">
          Already have an account?{' '}
          <Link className="auth-link" to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

