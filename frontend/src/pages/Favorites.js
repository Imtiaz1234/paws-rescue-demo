import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import CatCard from '../components/CatCard';

const Favorites = () => {
  const { favorites } = useContext(FavoritesContext);

  // Filter to show only available cats
  const availableFavorites = favorites.filter(cat => cat.adoptionStatus === 'Available');

  if (availableFavorites.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>My Favorites</h2>
        <p>No favorite cats yet, or all your favorites have been adopted! 🐾</p>
        <p>Browse available cats to add them to your favorites.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Favorites ({availableFavorites.length})</h2>
      <p>These are the cats you've shown interest in adopting:</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        {availableFavorites.map(cat => (
          <CatCard key={cat._id} cat={cat} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;