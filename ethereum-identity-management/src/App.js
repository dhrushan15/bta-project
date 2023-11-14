// Import necessary libraries
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import IdentityManagementABI from './contract/IdentityManagement.json'; 
import './App.css';

function App() {
  const contractAddress = '0x6151D9b356D725F4a3Ce1584b837E1675A9c1213';
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:3000'); 

  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [identityId, setIdentityId] = useState('');
  const [username, setUsername] = useState('');
  const [publicKey, setPublicKey] = useState('');

  useEffect(() => {
    async function init() {
      try {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);

          document.getElementById('connectButton').addEventListener('click', async () => {
            try {
              await window.ethereum.enable(); 
              const contract = new web3.eth.Contract(IdentityManagementABI, '0x6151D9b356D725F4a3Ce1584b837E1675A9c1213'); // Replace with the actual contract address
              setContract(contract);
              const accounts = await web3.eth.getAccounts();
              setAccounts(accounts);
            } catch (error) {
              console.error('Error connecting to MetaMask', error);
            }
          });
        } else {
          console.error('MetaMask not detected. Please install MetaMask and reload the page.');
        }
      } catch (error) {
        console.error('Error initializing web3', error);
      }
    }

    init();
  }, []);

  const createIdentity = async () => {
    try {
       // Call the createIdentity function on the contract
       const transaction = await contract.methods.createIdentity(username, publicKey).send({ from: accounts[0] });
 
       console.log('Transaction Receipt:', transaction);
 
       // Check if the IdentityCreated event is present
       if (transaction.events && transaction.events.IdentityCreated) {
          const identityId = transaction.events.IdentityCreated.returnValues.id;
          console.log('Identity created successfully! Identity ID:', identityId);
          setIdentityId(identityId);
       } else {
          console.error('IdentityCreated event not found in the transaction receipt.');
       }
    } catch (error) {
       console.error('Error creating identity', error);
    }
 };
 

  const verifyIdentity = async () => {
    try {
      // Call the verifyIdentity function on the contract
      await contract.methods.verifyIdentity(identityId).send({ from: accounts[0] });
    } catch (error) {
      console.error('Error verifying identity', error);
    }
  };

  const getIdentityDetails = async () => {
    try {
      // Call the getIdentityDetails function on the contract
      const details = await contract.methods.getIdentityDetails(identityId).call();
      console.log('Identity Details:', details);
    } catch (error) {
      console.error('Error getting identity details', error);
    }
  };

  return (

    
    <div className="App">
      <h1>Ethereum Identity Management</h1>
      <button id="connectButton">Connect to Wallet</button>
      <div>
        <h2>Create Identity</h2>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="text" placeholder="Public Key" onChange={(e) => setPublicKey(e.target.value)} />
        <button onClick={createIdentity}>Create Identity</button>
      </div>
      <div>
        <h2>Verify Identity</h2>
        <input type="text" placeholder="Identity ID" onChange={(e) => setIdentityId(e.target.value)} />
        <button onClick={verifyIdentity}>Verify Identity</button>
      </div>
      <div>
        <h2>Get Identity Details</h2>
        <input type="text" placeholder="Identity ID" onChange={(e) => setIdentityId(e.target.value)} />
        <button onClick={getIdentityDetails}>Get Identity Details</button>
      </div>
    </div>
  );
}

export default App;
