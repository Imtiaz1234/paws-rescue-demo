import React, { useState } from 'react';

const StoryForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to submit stories');
      return;
    }

    const res = await fetch('http://localhost:5000/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content })
    });

    if (res.ok) {
      alert('Story submitted!');
      setTitle('');
      setContent('');
    } else {
      alert('Error submitting story');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Share a Success Story</h3>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Your story" required />
      <button type="submit">Submit Story</button>
    </form>
  );
};

export default StoryForm;
