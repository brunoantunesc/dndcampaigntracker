import React from 'react';
import Header from '../components/Header';

const Dashboard = () => {
  return (
    <>
      <Header />
      <main style={{ padding: 20 }}>
        <h1>Welcome to the Dashboard!</h1>
        <p>You are successfully logged in.</p>
      </main>
    </>
  );
};

export default Dashboard;
