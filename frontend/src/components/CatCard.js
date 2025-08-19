import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/CatCard.css';

const CatCard = ({ cat }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, loading } = useContext(FavoritesContext);
  const { auth } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isFavorite = favorites.some(fav => fav._id === cat._id);

  const handleYesClick = () => {
    navigate(`/adoption/${cat._id}`);
  };
/*
  const handleFavoriteClick = async () => {
    if (!auth.token) {
      alert('Please login to add favorites');
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      await toggleFavorite(cat, auth.token);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsProcessing(false);
    }
  };*/
  const handleFavoriteClick = async () => {
  console.log('Favorite button clicked');
  console.log('Auth token exists:', !!auth.token);
  console.log('Current favorites:', favorites);
  console.log('Is currently favorite:', isFavorite);

  if (!auth.token) {
    alert('Please login to add favorites');
    return;
  }

  if (isProcessing) {
    console.log('Already processing, skipping');
    return;
  }

  setIsProcessing(true);
  console.log('Starting favorite toggle...');
  
  try {
    await toggleFavorite(cat, auth.token);
    console.log('Favorite toggle completed successfully');
    console.log('Updated favorites:', favorites);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    alert('Failed to update favorites. Please try again.');
  } finally {
    setIsProcessing(false);
    console.log('Processing completed');
  }
};
  // Only show available cats
  if (cat.adoptionStatus !== 'Available') {
    return null;
  }

  return (
    <div className="cat-card">
      <img 
        src={cat.images && cat.images.length > 0 ? cat.images[0] : '/default-cat.jpg'} 
        alt={cat.name} 
        className="cat-image" 
        loading="lazy" 
        onError={(e) => {
          e.target.src = '/default-cat.jpg';
        }}
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
      
      <button 
        onClick={handleFavoriteClick}
        disabled={isProcessing || loading}
        className={isFavorite ? 'favorite active' : 'favorite'}
      >
        {isProcessing ? '⏳' : isFavorite ? '💔 Remove Favorite' : '❤️ Favorite'}
      </button>
      
      <div style={{ marginTop: '1rem' }}>
        <p>Want to adopt the kitty?</p>
        <button onClick={handleYesClick}>Yes</button>
      </div>
    </div>
  );
};

export default CatCard;