import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const DonationForm = ({ onDonate }) => {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { darkMode } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await onDonate({ amount, purpose });
      setMessage('Thank you for your donation!');
      setAmount('');
      setPurpose('');
    } catch (err) {
      setMessage('Donation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="donation-form"
      onSubmit={handleSubmit}
      style={{
        background: darkMode ? '#23272f' : 'white',
        color: darkMode ? '#f1f1f1' : '#222',
        borderRadius: 12,
        boxShadow: darkMode
          ? '0 2px 8px rgba(0,0,0,0.5)'
          : '0 2px 8px rgba(0,0,0,0.1)',
        padding: '2rem',
        marginBottom: '2rem',
      }}
    >
      <h2>Donate to Help Our Cats</h2>
      <label>
        Amount ($):
        <input
          type="number"
          min="1"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          style={{
            background: darkMode ? '#181a20' : '#fff',
            color: darkMode ? '#f1f1f1' : '#222',
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: '0.5rem',
            marginLeft: 8,
          }}
        />
      </label>
      <label>
        Purpose:
        <input
          type="text"
          value={purpose}
          onChange={e => setPurpose(e.target.value)}
          placeholder="e.g. Medical bills, food"
          required
          style={{
            background: darkMode ? '#181a20' : '#fff',
            color: darkMode ? '#f1f1f1' : '#222',
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: '0.5rem',
            marginLeft: 8,
          }}
        />
      </label>
      <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
        {loading ? 'Processing...' : 'Donate'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default DonationForm;
