import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import RegistrationForm from './components/RegistrationForm';
import NavBar from './components/NavBar';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<div>Home Page</div>} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/register" element={<RegistrationForm />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
