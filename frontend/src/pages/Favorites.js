import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import CatCard from '../components/CatCard';

const Favorites = () => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  if (!favorites.length) return <div>No favorites yet.</div>;

  return (
    <div>
      <h2>My Favorites</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {favorites.map(cat => (
          <CatCard
            key={cat._id}
            cat={cat}
            onFavorite={toggleFavorite}
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
