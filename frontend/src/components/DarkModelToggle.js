import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      Switch to {darkMode ? 'Light' : 'Dark'} Mode
    </button>
  );
};

export default DarkModeToggle;
