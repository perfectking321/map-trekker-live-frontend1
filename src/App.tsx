import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import UserPage from './pages/UserPage';
import DriverInterface from './pages/DriverInterface';
import AdminInterface from './pages/AdminInterface';
import AuthPage from './pages/AuthPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/driver" element={<DriverInterface />} />
        <Route path="/admin" element={<AdminInterface />} />
        <Route path="/auth/:userType" element={<AuthPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
