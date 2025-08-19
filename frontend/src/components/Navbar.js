import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/stories">Stories</Link>
      {auth.user?.role === 'Admin' && <> | <Link to="/admin">Admin Dashboard</Link></>}
      {!auth.token && (
        <>
          {" | "}
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </>
      )}
      {auth.token && (
        <>
          {" | "}
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
