import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    document.body.classList.toggle('light-mode', !darkMode);

    // Aggressive JS override for all elements
    if (darkMode) {
      Array.from(document.querySelectorAll('*')).forEach(el => {
        el.style.backgroundColor = '#181a20';
        el.style.color = '#f1f1f1';
        el.style.borderColor = '#444';
      });
    } else {
      Array.from(document.querySelectorAll('*')).forEach(el => {
        el.style.backgroundColor = '';
        el.style.color = '';
        el.style.borderColor = '';
      });
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
