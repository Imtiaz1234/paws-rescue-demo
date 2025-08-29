import React, { createContext, useState, useEffect, useCallback } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load favorites from localStorage on initial load
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Function to sync favorites with backend
  const syncWithBackend = useCallback(async (token) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/user/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const backendFavorites = await res.json();
        setFavorites(backendFavorites);
      }
    } catch (error) {
      console.error('Failed to sync favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to add/remove favorite from backend
  const toggleFavoriteBackend = async (cat, token, isCurrentlyFavorite) => {
    try {
      if (isCurrentlyFavorite) {
        // Remove favorite: DELETE with catId as URL param
        const res = await fetch(`http://localhost:5000/api/user/favorites/${cat._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          return { success: true, data };
        }
        return { success: false };
      } else {
        // Add favorite: POST with catId in body
        const res = await fetch('http://localhost:5000/api/user/favorites', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ catId: cat._id })
        });
        if (res.ok) {
          const data = await res.json();
          return { success: true, data };
        }
        return { success: false };
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { success: false };
    }
  };

  const toggleFavorite = async (cat, token) => {
  const isCurrentlyFavorite = favorites.some(fav => fav._id === cat._id);
  console.log('toggleFavorite called:', cat, isCurrentlyFavorite);

  setFavorites(prev => {
    const newFavs = isCurrentlyFavorite ? prev.filter(fav => fav._id !== cat._id) : [...prev, cat];
    console.log('Updating favorites:', newFavs);
    return newFavs;
  });

  if (token) {
    const result = await toggleFavoriteBackend(cat, token, isCurrentlyFavorite);
    console.log('Backend toggle result:', result);
    
    if (!result.success) {
      setFavorites(prev => {
        const revertFavs = isCurrentlyFavorite ? [...prev, cat] : prev.filter(fav => fav._id !== cat._id);
        console.log('Reverting favorites due to backend failure:', revertFavs);
        return revertFavs;
      });
      throw new Error('Failed to update favorites');
    }

    await syncWithBackend(token);
  }
};


  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      toggleFavorite,
      syncWithBackend,
      loading
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};