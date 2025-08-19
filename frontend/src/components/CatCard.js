import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CatCard.css';

const CatCard = ({ cat, onFavorite, isFavorite }) => {
  const navigate = useNavigate();

  const handleYesClick = () => {
    navigate(`/adoption/${cat._id}`);
  };

  return (
    <div className="cat-card">
      <img 
        src={cat.images && cat.images.length > 0 ? cat.images[0] : '/default-cat.jpg'} 
        alt={cat.name} 
        className="cat-image" 
        loading="lazy" 
      />
      <h3>{cat.name}</h3>
      <p>Age: {cat.age}</p>
      <p>Health Status: {cat.healthStatus}</p>
      <p>Gender: {cat.gender || 'Unknown'}</p>
      <p>Special Needs: {cat.specialNeeds || 'None'}</p>
      {cat.rescueCenter && (
        <>
          <p>Rescue Center: {cat.rescueCenter.name}</p>
          <p>Location: {cat.rescueCenter.location || 'Unknown'}</p>
        </>
      )}
      <button onClick={() => onFavorite(cat._id)}>
        {isFavorite ? '💔 Remove Favorite' : '❤️ Favorite'}
      </button>
      <div style={{ marginTop: '1rem' }}>
        <p>Want to adopt the kitty?</p>
        <button onClick={handleYesClick}>Yes</button>
      </div>
    </div>
  );
};

export default CatCard;
