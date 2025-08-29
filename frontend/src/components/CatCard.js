import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';
import { AuthContext } from '../context/AuthContext';

import { ThemeContext } from '../context/ThemeContext';
import '../styles/CatCard.css';

const CatCard = ({ cat }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, loading } = useContext(FavoritesContext);
  const { auth } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [optimisticFavorite, setOptimisticFavorite] = useState(null);
  const isFavorite =
    optimisticFavorite !== null
      ? optimisticFavorite
      : favorites.some(fav => fav._id?.toString() === cat._id?.toString());

  const handleYesClick = () => {
    navigate(`/adoption/${cat._id}`);
  };
/*
  const handleFavoriteClick = async () => {
    console.log('Favorite button clicked for cat:', cat);
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
    if (!auth.token) {
      alert('Please login to add favorites');
      return;
    }
    if (isProcessing) return;
    setIsProcessing(true);
    // Optimistically update UI
    setOptimisticFavorite(!isFavorite);
    try {
      await toggleFavorite(cat, auth.token);
    } catch (error) {
      alert('Failed to update favorites. Please try again.');
      // Revert optimistic update on error
      setOptimisticFavorite(isFavorite);
    } finally {
      setIsProcessing(false);
      // After context updates, reset optimistic state
      setTimeout(() => setOptimisticFavorite(null), 500);
    }
  };



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
  <p><span style={{ color: darkMode ? '#f1f1f1' : 'black', fontWeight: 'bold' }}>Age:</span> {cat.age}</p>
  <p><span style={{ color: darkMode ? '#f1f1f1' : 'black', fontWeight: 'bold' }}>Health Status:</span> {cat.healthStatus}</p>
  <p><span style={{ color: darkMode ? '#f1f1f1' : 'black', fontWeight: 'bold' }}>Gender:</span> {cat.gender || 'Unknown'}</p>
  <p><span style={{ color: darkMode ? '#f1f1f1' : 'black', fontWeight: 'bold' }}>Special Needs:</span> {cat.specialNeeds || 'None'}</p>


      {cat.adoptionStatus === 'Pending' && (
        <p>
          <span style={{ color: darkMode ? '#f1f1f1' : 'black', fontWeight: 'bold' }}>Adoption Status:</span>
          <span style={{ color: 'orange', marginLeft: 6 }}>Pending Adoption</span>
        </p>
      )}
      {cat.adoptionStatus === 'Available' && (
        <p>
          <span style={{ color: darkMode ? '#f1f1f1' : 'black', fontWeight: 'bold' }}>Adoption Status:</span>
          <span style={{ color: 'green', marginLeft: 6 }}>Not Yet Adopted</span>
        </p>
      )}
      {cat.adoptionStatus === 'Adopted' && (
        <p>
          <span style={{ color: darkMode ? '#f1f1f1' : 'black', fontWeight: 'bold' }}>Adoption Status:</span>
          <span style={{ color: 'red', marginLeft: 6, fontWeight: 'bold' }}>Adopted</span>
        </p>
      )}


      {cat.rescueCenter && (
        <>
          <p><span style={{ color: darkMode ? '#f1f1f1' : 'black', fontWeight: 'bold' }}>Rescue Center:</span> {cat.rescueCenter.name}</p>
          <p><span style={{ color: darkMode ? '#f1f1f1' : 'black', fontWeight: 'bold' }}>Location:</span> {cat.rescueCenter.location || 'Unknown'}</p>
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
        <p><span style={{ color: darkMode ? '#f1f1f1' : 'black', fontWeight: 'bold' }}>Want to adopt the kitty?</span></p>
        <button onClick={handleYesClick}>Yes</button>
      </div>
    </div>
  );
};

export default CatCard;


