// UserPage.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ContractABI from './contract/IdentityManagement.json';

const UserPage = () => {
  const [contract, setContract] = useState('');
  const [newIdentity, setNewIdentity] = useState({
    username: '',
    publicKey: '',
    email: '',
    dateOfBirth: '',
  });
  const [connectedWallet, setConnectedWallet] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showCreateIdentityForm, setshowCreateIdentityForm] = useState(false);
  const [showgetIdentity, setshowgetIdentity] = useState(false);
  const [identityDetails, setIdentityDetails] = useState([]);
  const [selectedIdentityId, setSelectedIdentityId] = useState(null);
  const [allIdentities, setAllIdentities] = useState([]);

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
  }, []); 

  const handleInputChange = (e) => {
    // Input change handler logic
    const { name, value } = e.target;
    setNewIdentity((prevIdentity) => ({
      ...prevIdentity,
      [name]: value,
    }));
  };

  const createIdentity = async () => {
    try {
      // Create identity logic
      const { username, publicKey, email, dateOfBirth } = newIdentity;
      const gasLimit = 800000; // Adjust this value as needed

      const txCreate = await contract.createIdentity(username, publicKey, email, dateOfBirth, {
        gasLimit,
      });
      const receipt = await txCreate.wait();

      console.log("Transaction Reciept : ",receipt);

      // Extract the created identity ID from the transaction receipt
      const createdIdentityId = receipt.events[0].args.id.toString();

      // Log the created identity ID
      console.log('Identity ID created:', createdIdentityId);

      setshowCreateIdentityForm(false);

      alert('Identity created!');
    } catch (error) {
      console.error('Error creating identity:', error.message);
    }
  };

  const updateProfile = async () => {
    try {
      // Update profile logic
      const { email, dateOfBirth } = newIdentity;
      const gasLimit = 800000; // Adjust this value as needed

      // Check for empty or null values
      if (!email || !dateOfBirth) {
        throw new Error('Email and Date of Birth cannot be empty.');
      }

      const txUpdate = await contract.updateProfile(selectedIdentityId, email, dateOfBirth, {
        gasLimit,
      });
      const receipt = await txUpdate.wait();

      // Log transaction details
      console.log('Update Profile Receipt:', receipt);

      alert('Profile updated!');
    //   getIdentityDetails(); // Refresh identity details after the update
    //   getAllIdentities();
      setShowUpdateForm(false); // Hide the update form after submission
    } catch (error) {
      console.error('Error updating profile:', error.message);
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
      setshowgetIdentity(false);
    } catch (error) {
      console.error('Error getting identity details:', error.message);
    }
  };

  // Function to get identities by wallet address
  const getIdentitiesByAddress = async () => {
    try {
      // Check if connectedWallet is set
      if (!connectedWallet) {
        alert('Please connect to a wallet first.');
        return;
      }

      // Call the smart contract function to get identities by wallet address
      const identities = await contract.getIdentitiesByAddress(connectedWallet);

      // Update the state with the retrieved identities
      setAllIdentities(identities);
    } catch (error) {
      console.error('Error getting identities by address:', error.message);
    }
  };

  return (
    <div>
      <h2>User Page</h2>
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

{showCreateIdentityForm && (
          <form>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={newIdentity.username}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Public Key:
              <input
                type="text"
                name="publicKey"
                value={newIdentity.publicKey}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="text"
                name="email"
                value={newIdentity.email}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Date of Birth:
              <input
                type="text"
                name="dateOfBirth"
                value={newIdentity.dateOfBirth}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <button type="button" onClick={createIdentity}>
              Create Identity
            </button>

            <button type="button" onClick={() => setshowCreateIdentityForm(false)}>
                Cancel
              </button>
          </form>
          )}

          {/* Create Identity Button */}
          {!showCreateIdentityForm && (
            <button type="button" onClick={() => setshowCreateIdentityForm(true)}>
              Create Identity
            </button>
          )}


          {/* Conditional Rendering: Show Update Profile Form */}
          {showUpdateForm && (
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
              <br />
              <label>
                Email:
                <input
                  type="text"
                  name="email"
                  value={newIdentity.email}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <label>
                Date of Birth:
                <input
                  type="text"
                  name="dateOfBirth"
                  value={newIdentity.dateOfBirth}
                  onChange={handleInputChange}
                />
              </label>
              <br />
              <button type="button" onClick={updateProfile}>
                Update Profile
              </button>
              <button type="button" onClick={() => setShowUpdateForm(false)}>
                Cancel
              </button>
            </form>
          )}

          {/* Update Profile Button */}
          {!showUpdateForm && (
            <button type="button" onClick={() => setShowUpdateForm(true)}>
              Update Profile
            </button>
          )}

          {/* Form for getting identity details */}
          {showgetIdentity && (
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
            <br />
              <button type="button" onClick={getIdentityDetails}>
                Get Identity Details
              </button>
              <button type="button" onClick={() => setshowgetIdentity(false)}>
                Cancel
              </button>
            </form>
          )}
          {!showgetIdentity &&(
            <button type="button" onClick={()=>setshowgetIdentity(true)}>
              Get Identity Details
            </button>

          )}

            {identityDetails.map((iden) => (
            <div key={iden.id.toString()} className="container">
              <p>id: {iden.id.toString()}</p>
              <p>Your Wallet Address: {iden.owner}</p>
              <p>Your Public Key: {iden.publicKey}</p>
              <p>Your Username: {iden.username}</p>
              <p>Your Email Address: {iden.email}</p>
              <p>Date of Birth: {iden.dateOfBirth}</p>
              <p>Verification Status  :{iden.isVerified.toString()}</p>
            </div>
          ))}

          {/* Button to get identities by address */}
            <button type="button" onClick={getIdentitiesByAddress}>
                Get Identities by Address
            </button>

            {/* Display all identities */}
            {allIdentities.map((identity) => (
                <div key={identity.id.toString()} className="container">
                {/* Display identity information here */}
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

export default UserPage;
