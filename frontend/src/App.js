import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import FavoritesSync from './components/FavoritesSync';
import Home from './pages/Home';
import Stories from './pages/Stories';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CatRegister from './pages/CatRegister';
import AdoptionForm from './pages/AdoptionForm';
import Favorites from './pages/Favorites';
import RescueCenterDashboard from './pages/RescueCenterDashboard';
import RescueAdoptions from './pages/RescueAdoptionsDashboard'; // Import RescueAdoptions page

import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';


import Donations from './pages/Donations';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <Navbar />
            <FavoritesSync />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Public Donations page */}
              <Route path="/donations" element={<Donations />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="Admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cat-register"
                element={
                  <ProtectedRoute role="Rescue">
                    <CatRegister />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/rescue-dashboard"
                element={
                  <ProtectedRoute role="Rescue">
                    <RescueCenterDashboard />
                  </ProtectedRoute>
                }
              />

              {/* New Rescue Adoptions route for Rescue role */}
              <Route
                path="/rescue-adoptions"
                element={
                  <ProtectedRoute role="Rescue">
                    <RescueAdoptions />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/adoption/:catId"
                element={
                  <ProtectedRoute role="User">
                    <AdoptionForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/favorites"
                element={
                  <ProtectedRoute role="User">
                    <Favorites />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
