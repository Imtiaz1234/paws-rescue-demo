
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DarkModeToggle from './DarkModelToggle';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);


  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        background: 'var(--navbar-bg, #fff)',
        color: 'var(--navbar-text, #222)',
        padding: '1rem 2vw',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
  <div style={{ flex: 1, minWidth: 0 }}>
  <Link to="/" style={{ color: 'inherit' }}>Home</Link> | <Link to="/stories" style={{ color: 'inherit' }}>Stories</Link> | <Link to="/donations" style={{ color: 'inherit' }}>Donations</Link>

        {/* Admin Links */}
        {auth.user?.role === 'Admin' && (
          <>
            {' '}| <Link to="/admin" style={{ color: 'inherit' }}>Admin Dashboard</Link>
          </>
        )}

        {/* Rescue Center Links */}
        {auth.user?.role === 'Rescue' && (
          <>
            {' '}| <Link to="/rescue-dashboard" style={{ color: 'inherit' }}>Rescue Dashboard</Link>
            {' '}| <Link to="/cat-register" style={{ color: 'inherit' }}>Add Cat</Link>
            {' '}| <Link to="/rescue-adoptions" style={{ color: 'inherit' }}>Adoption Applications</Link>
          </>
        )}

        {/* User Links */}
        {auth.user?.role === 'User' && (
          <>
            {' '}| <Link to="/favorites" style={{ color: 'inherit' }}>My Favorites</Link>
          </>
        )}

        {/* Authentication Links */}
        {!auth.token && (
          <>
            {' '}| <Link to="/login" style={{ color: 'inherit' }}>Login</Link> | <Link to="/register" style={{ color: 'inherit' }}>Register</Link>
          </>
        )}

        {auth.token && (
          <>
            {' '}|{' '}
            <button
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                color: 'blue',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
  <div style={{ flexShrink: 0 }}>
  <DarkModeToggle />
      </div>
  </nav>
  );
};

export default Navbar;
