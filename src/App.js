import './App.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CarRegistry from './artifacts/contracts/CarRegistry.sol/CarRegistry.json';

const carRegistryAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3" +
    "";

function App() {
  const [currentOwner, setCurrentOwner] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [carIdToTransfer, setCarIdToTransfer] = useState(0);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  useEffect(() => {
    fetchData();
  }, [carIdToTransfer]);

  async function fetchData() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(carRegistryAddress, CarRegistry.abi, provider);

        const carId = parseInt(carIdToTransfer);
        const owner = await contract.getOwner(carId);
        setCurrentOwner(owner);
      }
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  }

  async function transferOwnership() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(carRegistryAddress, CarRegistry.abi, signer);

        const transaction = await contract.assignOwnership(carIdToTransfer, currentOwner, newOwner, { gasLimit: 300000 });
        await transaction.wait();

        const updatedOwner = await contract.getOwner(carIdToTransfer);
        setCurrentOwner(updatedOwner);
      }
    } catch (err) {
      console.log("Error transferring ownership:", err.message);
    }
  }

  return (
      <div className="App">
        <header className="App-header">
          <p>Current Owner: {currentOwner}</p>
          <input
              onChange={(e) => setNewOwner(e.target.value)}
              placeholder="Enter new owner address"
          />
          <input
              onChange={(e) => setCarIdToTransfer(e.target.value)}
              placeholder="Enter car ID to transfer"
          />
          <button onClick={transferOwnership}>Transfer Ownership</button>
        </header>
      </div>
  );
}

export default App;
