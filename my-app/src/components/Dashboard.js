import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    //const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('token_expiry'); // Assuming expiry time is stored in localStorage

    const checkExpiry = () => {
      const currentTime = new Date().getTime();
      if (currentTime >= expiry) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiry');
        navigate('/login');
      }
    };

    const timer = setInterval(checkExpiry, 60000); // Check every 5 seconds

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [navigate]);

  return <div>Welcome to Your Dashboard!</div>;
};

export default Dashboard;