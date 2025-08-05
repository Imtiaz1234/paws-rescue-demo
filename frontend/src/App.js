import { useState } from 'react';
import axios from 'axios';

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('register'); // for 'register' or 'login' pocess
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const testRegister = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name || "Test User",
        email: formData.email || `test${Math.random().toString(36).substring(2, 7)}@example.com`,
        password: formData.password || "123456"
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      
      setResponse({ type: 'register', data: res.data });
    } catch (err) {
      setError({
        message: err.response?.data?.error?.message || err.message,
        details: err.response?.data || 'Registration failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email || "test@example.com",
        password: formData.password || "123456"
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      
      setResponse({ type: 'login', data: res.data });
    } catch (err) {
      setError({
        message: err.response?.data?.error?.message || err.message,
        details: err.response?.data || 'Login failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>PawsRescue Auth System</h1>
        <p className="subtitle">Test User Registration & Login</p>
      </header>

      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Register
        </button>
        <button
          className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
      </div>

      <main className="app-content">
        {activeTab === 'register' && (
          <div className="form-container">
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Test User"
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="test@example.com"
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="123456"
              />
            </div>
            <button
              onClick={testRegister}
              disabled={loading}
              className={`action-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <span className="button-loading">
                  <span className="spinner"></span> Registering...
                </span>
              ) : (
                'Test Registration'
              )}
            </button>
          </div>
        )}

        {activeTab === 'login' && (
          <div className="form-container">
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="test@example.com"
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="123456"
              />
            </div>
            <button
              onClick={testLogin}
              disabled={loading}
              className={`action-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <span className="button-loading">
                  <span className="spinner"></span> Logging in...
                </span>
              ) : (
                'Test Login'
              )}
            </button>
          </div>
        )}

        {loading && <p className="status-message">Communicating with server...</p>}

        {error && (
          <div className="response-card error">
            <h3>Operation Failed</h3>
            <div className="error-details">
              <p><strong>Error:</strong> {error.message}</p>
              {error.details && (
                <pre>{JSON.stringify(error.details, null, 2)}</pre>
              )}
            </div>
          </div>
        )}

        {response && (
          <div className="response-card success">
            <h3>
              {response.type === 'register' ? 'Registration Successful!' : 'Login Successful!'}
            </h3>
            <div className="user-details">
              {response.type === 'register' ? (
                <>
                  <p><strong>Name:</strong> {response.data.name}</p>
                  <p><strong>Email:</strong> {response.data.email}</p>
                  <p><strong>Role:</strong> {response.data.role}</p>
                </>
              ) : (
                <>
                  <p><strong>Welcome back!</strong></p>
                  <p><strong>Email:</strong> {response.data.user.email}</p>
                  <p><strong>Token:</strong> {response.data.token.substring(0, 20)}...</p>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .app-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }

        .app-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .app-header h1 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #7f8c8d;
          margin-top: 0;
        }

        .tab-container {
          display: flex;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .tab-button {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: #7f8c8d;
          position: relative;
        }

        .tab-button.active {
          color: #3498db;
          font-weight: 600;
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background: #3498db;
        }

        .app-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-weight: 500;
          color: #2c3e50;
        }

        .input-group input {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .action-button {
          padding: 0.75rem 1.5rem;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 1rem;
        }

        .action-button:hover {
          background: #2980b9;
        }

        .action-button.loading {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .button-loading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .status-message {
          text-align: center;
          color: #7f8c8d;
          font-style: italic;
        }

        .response-card {
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .error {
          background: #fdecea;
          border-left: 4px solid #e53935;
        }

        .success {
          background: #e8f5e9;
          border-left: 4px solid #43a047;
        }

        .response-card h3 {
          margin-top: 0;
          margin-bottom: 1rem;
        }

        .error h3 {
          color: #e53935;
        }

        .success h3 {
          color: #2e7d32;
        }

        .user-details p {
          margin: 0.5rem 0;
        }

        pre {
          background: rgba(0,0,0,0.05);
          padding: 0.75rem;
          border-radius: 4px;
          overflow-x: auto;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

export default App;


//making changes for the push