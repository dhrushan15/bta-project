import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import ContractABI from './contract/IdentityManagement.json';

const App = () => {
  const [contract, setContract] = useState(null);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [identityDetails, setIdentityDetails] = useState(null);

  const [newIdentity, setNewIdentity] = useState({
    username: '',
    publicKey: '',
    email: '',
    dateOfBirth: '',
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  useEffect(() => {
    let isMounted = true;

    const initializeContract = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const signer = provider.getSigner();

        const contractAddress = '0x9b50dfd6996Ed6D45fb4D99cEbad3882f7a0f5A5';
        const contractAbi = ContractABI.abi;

        const identityContract = new ethers.Contract(contractAddress, contractAbi, signer);

        if (isMounted) {
          setContract(identityContract);

          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setConnectedWallet(accounts[0]);
          }
        }
      }
    };

    initializeContract();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array for one-time initialization

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setConnectedWallet(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error.message);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIdentity((prevIdentity) => ({
      ...prevIdentity,
      [name]: value,
    }));
  };

  const createIdentity = async () => {
    try {
      const { username, publicKey, email, dateOfBirth } = newIdentity;
      const gasLimit = 800000; // Adjust this value as needed
      const gasPrice = await provider.getGasPrice();

      const txCreate = await contract.createIdentity(username, publicKey, email, dateOfBirth, {
        gasLimit,
        gasPrice,
      });
      const receipt = await txCreate.wait();

      // Log transaction details
      console.log('Transaction Receipt:', receipt);

      const identityId = receipt.events.find((event) => event.event === 'IdentityCreated').args.id.toNumber();

      const createdIdentity = await contract.getIdentityDetails(identityId);

      // Log the created identity details
      console.log('Identity Created:', createdIdentity);

      alert('Identity created!');
    } catch (error) {
    }
  };

  const getIdentityDetails = async () => {
    try {
      const details = await contract.getIdentityDetails(1); // Assuming identity with ID 1 exists
      setIdentityDetails(details);
    } catch (error) {
      console.error('Error getting identity details:', error.message);
    }
  };

  return (
    <div className="App">
      <h1>Identity Management DApp</h1>
      {!connectedWallet ? (
        <button onClick={connectWallet}>Connect to Wallet</button>
      ) : (
        <div>
          <p>Connected Wallet: {connectedWallet}</p>

          {/* New Identity Form */}
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
          </form>

          <button onClick={getIdentityDetails}>Get Identity Details</button>
        </div>
      )}

      {identityDetails && (
        <div>
          <h2>Identity Details</h2>
          <pre>{JSON.stringify(identityDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
