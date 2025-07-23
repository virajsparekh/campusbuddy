import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome{user && user.name ? `, ${user.name}` : ''}!</h1>
      <p>This is your dashboard.</p>
    </div>
  );
};

export default Dashboard; 