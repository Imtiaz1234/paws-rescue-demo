import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <FavoritesProvider>
      <App />  {/* App includes the Router */}
    </FavoritesProvider>
  </ThemeProvider>
);
