// App.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './styles.css';
import ContractABI from './contract/IdentityManagement.json';
import OwnerPage from './OwnerPage';
import UserPage from './UserPage';
import VerificationPage from './VerificationPage';

const App = () => {
  // Common state and functions for both owner and user pages

  const [currentPage, setCurrentPage] = useState(''); // 'owner' or 'user'

  return (
    <div className="App">
      <h1>Identity Management Decentralized App</h1>
      {currentPage === 'owner' && <OwnerPage />}
      {currentPage === 'user' && <UserPage />}
      {currentPage === 'verification' && <VerificationPage />}
      {currentPage === '' && (
        <div>
          {/* Buttons to navigate to owner and user pages */}
          <button onClick={() => setCurrentPage('owner')}>Go to Owner Page</button>
          <button onClick={() => setCurrentPage('user')}>Go to User Page</button>
          <button onClick={() => setCurrentPage('verification')}>Go to Verification Page</button>
        </div>
      )}
    </div>
  );
};

export default App;
