import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './index';

// Set up the evaluation interface for contract interaction
window.__EVAL__ = {
  getBalance: async (address) => {
    // Mock implementation - would connect to contract in production
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        process.env.REACT_APP_FAUCET_ADDRESS,
        ['function balanceOf(address) view returns (uint256)'],
        provider
      );
      const balance = await contract.balanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      return '0';
    }
  },
  
  requestTokens: async (address) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.REACT_APP_FAUCET_ADDRESS,
        ['function requestTokens() public'],
        signer
      );
      const tx = await contract.requestTokens();
      const receipt = await tx.wait();
      return {
        amount: '100',
        transactionHash: receipt.transactionHash
      };
    } catch (error) {
      console.error('Error requesting tokens:', error);
      throw error;
    }
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
