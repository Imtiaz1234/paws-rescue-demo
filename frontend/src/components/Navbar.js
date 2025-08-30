
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DarkModeToggle from './DarkModelToggle';

const Navbar = () => {
  const { auth, logout, login, setUser } = useContext(AuthContext);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(auth.user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleNameSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/user/update-name', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          // Use the new token with updated name
          login(data.token);
        } else if (auth.user && data.name && data.name !== auth.user.name) {
          setUser({ ...auth.user, name: data.name });
        } else {
          login(auth.token); // fallback: re-decode user from token
        }
        setEditingName(false);
      } else {
        alert('Failed to update name');
      }
    } finally {
      setSaving(false);
    }
  };


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
  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
    {auth.token && auth.user && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {editingName ? (
          <>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              disabled={saving}
              style={{ borderRadius: 4, padding: '2px 6px', fontSize: 14 }}
            />
            <button onClick={handleNameSave} disabled={saving || !newName.trim()} style={{ fontSize: 14 }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditingName(false); setNewName(auth.user.name); }} disabled={saving} style={{ fontSize: 14 }}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <span style={{ fontWeight: 500, fontSize: 15, display: 'inline-block' }} title={auth.user.name}>
              {auth.user.name}
            </span>
          </>
        )}
      </div>
    )}
    <DarkModeToggle />
  </div>
  </nav>
  );
};

export default Navbar;
