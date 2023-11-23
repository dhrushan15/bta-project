// OwnerPage.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ContractABI from './contract/IdentityManagement.json';

const OwnerPage = () => {
  const [contract, setContract] = useState('');
  const [allIdentities, setAllIdentities] = useState([]);
  const [showVerificationForm, setshowVerificationForm] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState('');
  const [selectedIdentityId, setSelectedIdentityId] = useState(null);
  const [identityDetails, setIdentityDetails] = useState([]);
  const expectedWalletAddress = '0x59e0b115b0accd55d8ed43223a1661c10025ad0d';

  useEffect(() => {
    const initializeContract = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          const contractAddress = '0x901b43225177a781AA49Ea256d94D76550dfd0E6';
          const contractAbi = ContractABI.abi;

          const identityContract = new ethers.Contract(contractAddress, contractAbi, signer);

          setContract(identityContract);
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setConnectedWallet(accounts[0]);
          }
        }
      } catch (error) {
        console.error('Error initializing contract:', error.message);
      }
    };

    initializeContract();

    // Cleanup function
    return () => {
      // Any cleanup logic if needed
    };
  }, []); // Empty dependency array for one-time initialization


  // Check if the connected wallet matches the expected address
  if (connectedWallet !== expectedWalletAddress) {
    return (
      <div>
        <h2>Unauthorized Access</h2>
        <p>This page is accessible only for a specific wallet address.</p>
        <p>Please connect with the authorized wallet.</p>
      </div>
    );
  }

  const getIdentityDetails = async () => {
    try {
      // Check if selectedIdentityId is set
      if (!selectedIdentityId) {
        alert('Please enter an Identity ID to fetch details.');
        return;
      }

      // Call the smart contract function to get identity details
      const details = await contract.getIdentityDetails(selectedIdentityId);

      // Update the state with the retrieved identity details
      setIdentityDetails([details]);
    } catch (error) {
      console.error('Error getting identity details:', error.message);
    }
  };


  const verifyIdentity = async (userId) => {
    try {
      // Verify user logic
      const gasLimit = 800000; // Adjust this value as needed

      const txVerify = await contract.verifyIdentity(selectedIdentityId, {
        gasLimit,
      });
      const receipt = await txVerify.wait();

      // Log transaction details
      console.log('Verify Identity Receipt:', receipt);

      alert('Identity verified!');
    //   getIdentityDetails(); // Refresh identity details after verification
    //   getAllIdentities();
      setshowVerificationForm(false);

    } catch (error) {
      console.error('Error verifying user:', error.message);
    }
  };

  const getAllIdentities = async () => {
    try {
      // Get all identities logic
       // Call the smart contract function to get all identities
       const identities = await contract.getAllIdentities();

       // Update the state with the retrieved identities
       setAllIdentities(identities);
    } catch (error) {
      console.error('Error getting all identities:', error.message);
    }
  };

  

  return (
    <div>
      <h2>Owner Page</h2>
      {!connectedWallet ? (
        <button onClick={async () => {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setConnectedWallet(accounts[0]);
          }
        }}>Connect to Wallet</button>
      ) : (
        <p>Connected Wallet: {connectedWallet}</p>
      )}

      {/* Verify Identity Button */}
      {showVerificationForm && (
          <form>
              <label>
                Identity Id:
                <input
                  type="text"
                  name="identityId"
                  value={selectedIdentityId}
                  onChange={(e) => setSelectedIdentityId(e.target.value)}
                />
              </label>

              <button type="button" onClick={verifyIdentity}>
                Verify Identity
              </button>
              <button type="button" onClick={() => setshowVerificationForm(false)}>
                Cancel
              </button>
          </form>
          )}


          {!showVerificationForm && (
          <button type="button" onClick={()=>setshowVerificationForm(true)}>
            Verify Identity
          </button>
          )}


      <button onClick={getAllIdentities}>Get All Identities</button>
      {allIdentities.map((identity) => (
        <div key={identity.id.toString()} className="container">
          {/* Display identity information */}
            <p>id: {identity.id.toString()}</p>
            <p>Your Wallet Address: {identity.owner}</p>
            <p>Your Public Key: {identity.publicKey}</p>
            <p>Your Username: {identity.username}</p>
            <p>Your Email Address: {identity.email}</p>
            <p>Date of Birth: {identity.dateOfBirth}</p>
            <p>Verification Status  :{identity.isVerified.toString()}</p>
        </div>
      ))}
    </div>
  );
};

export default OwnerPage;
