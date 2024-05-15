import React, { useEffect } from 'react';
import api from '../utilities/api';
import { getFingerprint } from '../utilities/fingerprint'; 

const Dashboard = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const fingerprintData = await getFingerprint();

        const response = await api.get('/protected', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'fingerprint': JSON.stringify(fingerprintData),
          },
        });
        console.log('Protected data:', response.data);
      } catch (error) {
        console.error('Error fetching protected data', error);
      }
    };

    fetchData();
  }, []);

  return <div>Welcome to the Dashboard!</div>;
};

export default Dashboard;
