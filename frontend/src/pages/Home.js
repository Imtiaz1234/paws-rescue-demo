import React, { useState, useEffect, useContext } from 'react';
import CatCard from '../components/CatCard';
import SearchFilter from '../components/SearchFilter';
import { FavoritesContext } from '../context/FavoritesContext';




const Home = () => {
  const [cats, setCats] = useState([]);
  const [filters, setFilters] = useState({});
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    const fetchCats = async () => {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
      );
      const query = new URLSearchParams(cleanFilters).toString();
      const res = await fetch(`http://localhost:5000/api/cats?${query}`);
      const data = await res.json();
      setCats(data);
    };

    fetchCats();
  }, [filters]);

  return (
    <div>
      <h1>PawsRescue - Find Your Cat</h1>
      <SearchFilter onSearch={setFilters} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {cats.map((cat) => (
          <CatCard
            key={cat._id}
            cat={cat}
            onFavorite={toggleFavorite}
            isFavorite={favorites.includes(cat._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

