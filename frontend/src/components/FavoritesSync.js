import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FavoritesContext } from '../context/FavoritesContext';

const FavoritesSync = () => {
  const { auth } = useContext(AuthContext);
  const { syncWithBackend } = useContext(FavoritesContext);

  useEffect(() => {
    if (auth.token) {
      syncWithBackend(auth.token);
    }
  }, [auth.token, syncWithBackend]);

  return null;
};

export default FavoritesSync;