import React, { useEffect, useState } from 'react';

const StoryList = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      const res = await fetch('http://localhost:5000/api/stories');
      const data = await res.json();
      setStories(data);
    };
    fetchStories();
  }, []);

  return (
    <div>
      <h2>Success Stories</h2>
      {stories.map(story => (
        <div key={story._id} style={{ border: '1px solid #ccc', marginBottom: 20, padding: 10 }}>
          <h3>{story.title}</h3>
          <p>{story.content}</p>
          <small>By: {story.rescueCenter?.name || 'Unknown'}</small>
        </div>
      ))}
    </div>
  );
};

export default StoryList;
