import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/StoryForm.css';

const StoryForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { auth } = useContext(AuthContext);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.token || auth.user.role !== 'Rescue') {
      setError('Only rescue centers can post stories');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:5000/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to create story');

      setSuccess('Story posted successfully!');
      setFormData({ title: '', content: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!auth.token || auth.user.role !== 'Rescue') {
    return null;
  }

  return (
    <div className="story-form">
      <h3>Share a Success Story</h3>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Story</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="5"
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Story'}
        </button>
      </form>
    </div>
  );
};

export default StoryForm;