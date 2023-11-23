// VerificationPage.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import ContractABI from './contract/IdentityManagement.json'; // Import your contract ABI here

const VerificationPage = () => {
  const [identityId, setIdentityId] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [username, setUsername] = useState('');

  const handleVerification = async () => {
    try {
      // Connect to your Ethereum provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Get the signer (assuming the user is using MetaMask)
      const signer = provider.getSigner();

      // Replace 'YourContractAddress' with the actual address of your deployed smart contract
      const contractAddress = '0x901b43225177a781AA49Ea256d94D76550dfd0E6';

      // Create a contract instance
      const contract = new ethers.Contract(contractAddress, ContractABI.abi, signer);

      // Call the verifyCredentials function on the smart contract
      const transaction = await contract.verifyCredentials(
        identityId,
        email,
        dateOfBirth,
        username
      );

      // Wait for the transaction to be mined
      await transaction.wait();

      // Verification successful
      alert('Verification successful');

      // Update state or perform any other necessary actions after verification

    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error('Error during verification:', error.message);

      // Invalid details
      alert('Invalid details. Verification failed.');
    }
  };

  return (
    <div>
      <h2>Verification Page</h2>
      <p>This Page is like a other random website where they website need's to verify Your Identity Wheather the details are Correct or Wrong</p>
      <form>
        <label>
          Identity ID:
          <input type="text" value={identityId} onChange={(e) => setIdentityId(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Date of Birth:
          <input type="text" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
        </label>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <button type="button" onClick={handleVerification}>
          Verify Credentials
        </button>
      </form>
    </div>
  );
};

export default VerificationPage;
