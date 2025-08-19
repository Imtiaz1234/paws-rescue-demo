import React, { useState, useEffect, useContext } from 'react';
import CatCard from '../components/CatCard';
import SearchFilter from '../components/SearchFilter';
import { FavoritesContext } from '../context/FavoritesContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const [cats, setCats] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { favorites } = useContext(FavoritesContext);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        setError('');
        
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
        );
        
        const query = new URLSearchParams(cleanFilters).toString();
        const res = await fetch(`http://localhost:5000/api/cats?${query}`);
        
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        
        const data = await res.json();
        setCats(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load cats. Please try again later.');
        setCats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, [filters]);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>PawsRescue - Find Your Feline Friend</h1>
        <p>Connect with rescue centers and give a cat their forever home</p>
      </header>
      
      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
          <div>
            <small>Make sure the backend server is running on port 5000</small>
          </div>
        </div>
      )}
      
      <section className="search-section">
        <h2>Search for Cats</h2>
        <SearchFilter onSearch={setFilters} />
      </section>
      
      <section className="cats-section">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading available cats...</p>
          </div>
        ) : cats.length === 0 ? (
          <div className="no-cats">
            <h3>No cats available for adoption at the moment</h3>
            <p>Check back later or contact local rescue centers directly</p>
          </div>
        ) : (
          <>
            <h3>Available Cats ({cats.length})</h3>
            <div className="cats-grid">
              {cats.map((cat) => (
                <CatCard
                  key={cat._id}
                  cat={cat}
                  isFavorite={favorites.some(fav => fav._id === cat._id)}
                />
              ))}
            </div>
          </>
        )}
      </section>
      
      {!auth.token && (
        <section className="cta-section">
          <h2>Ready to Adopt?</h2>
          <p>Create an account to start your adoption journey</p>
          <div className="cta-buttons">
            <a href="/register" className="btn btn-primary">Sign Up</a>
            <a href="/login" className="btn btn-secondary">Login</a>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;