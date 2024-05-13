import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
      <Route path="/" element={
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <img src="/blogimage.png" alt="Your App Logo" style={{ maxWidth: '200px' }} />
    <h1>Progressive Web App</h1>
  </div>
} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
      </Routes>
    </Router>
  );
}

export default App;