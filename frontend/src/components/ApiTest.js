import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const ApiTest = () => {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const data = await api.get('/');
        setStatus(`✅ Connected: ${data}`);
      } catch (error) {
        setStatus(`❌ Error: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '1rem', background: '#f0f0f0', margin: '1rem 0' }}>
      <h3>API Connection Test</h3>
      <p>Status: {status}</p>
    </div>
  );
};

export default ApiTest;