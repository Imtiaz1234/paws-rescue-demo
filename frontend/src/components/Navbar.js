import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/stories">Stories</Link>
      
      {/* Admin Links */}
      {auth.user?.role === 'Admin' && <> | <Link to="/admin">Admin Dashboard</Link></>}
      
      {/* Rescue Center Links */}
      {auth.user?.role === 'Rescue' && (
        <>
          {" | "}
          <Link to="/rescue-dashboard">Rescue Dashboard</Link>
          {" | "}
          <Link to="/cat-register">Add Cat</Link>
        </>
      )}
      
      {/* User Links (if you want to add any) */}
      {auth.user?.role === 'User' && (
        <>
          {" | "}
          <Link to="/favorites">My Favorites</Link>
        </>
      )}
      
      {/* Authentication Links */}
      {!auth.token && (
        <>
          {" | "}
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </>
      )}
      
      {auth.token && (
        <>
          {" | "}
          <button onClick={logout} style={{ 
            background: 'none', 
            border: 'none', 
            color: 'blue', 
            textDecoration: 'underline', 
            cursor: 'pointer' 
          }}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
};

export default Navbar;