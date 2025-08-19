import React, { useState, useEffect } from 'react';
import '../styles/StoryList.css';

const StoryList = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/stories');
        if (!res.ok) throw new Error('Failed to fetch stories');
        const data = await res.json();
        setStories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) return <div className="loading">Loading stories...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="story-list">
      <h2>Success Stories</h2>
      <div className="stories-grid">
        {stories.map(story => (
          <div key={story._id} className="story-card">
            <h3>{story.title}</h3>
            <p className="story-content">{story.content}</p>
            {story.rescueCenter && (
              <p className="story-rescue">
                From: {story.rescueCenter.name}
              </p>
            )}
            <p className="story-date">
              {new Date(story.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryList;