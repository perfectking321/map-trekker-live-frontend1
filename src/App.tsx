import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import UserPage from './pages/UserPage';
import DriverInterface from './pages/DriverInterface';
import AdminInterface from './pages/AdminInterface'; // Corrected import

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/driver" element={<DriverInterface />} />
        <Route path="/admin" element={<AdminInterface />} /> {/* Corrected component */}
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
