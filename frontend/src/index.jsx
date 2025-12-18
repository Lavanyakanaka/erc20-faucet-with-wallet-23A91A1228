import React, { useState, useEffect } from 'react';
import './index.css';

const App = () => {
  const [account, setAccount] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [faucetAmount, setFaucetAmount] = useState('0');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        fetchBalance(accounts[0]);
      } else {
        setMessage('Please install MetaMask');
      }
    } catch (error) {
      setMessage('Error connecting wallet: ' + error.message);
    }
  };

  const fetchBalance = async (userAccount) => {
    try {
      // Call faucet contract method to get balance
      const balance = await window.__EVAL__.getBalance(userAccount);
      setTokenBalance(balance);
    } catch (error) {
      setMessage('Error fetching balance: ' + error.message);
    }
  };

  const requestTokens = async () => {
    setLoading(true);
    try {
      const tx = await window.__EVAL__.requestTokens(account);
      setMessage('Tokens claimed successfully!');
      setFaucetAmount(tx.amount);
      await fetchBalance(account);
    } catch (error) {
      setMessage('Error claiming tokens: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>ERC-20 Token Faucet</h1>
        <div className="info">
          <p>Account: {account || 'Not connected'}</p>
          <p>Balance: {tokenBalance} tokens</p>
        </div>
        <button 
          onClick={requestTokens} 
          disabled={loading || !account}
          className="claim-button"
        >
          {loading ? 'Processing...' : 'Claim Tokens'}
        </button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default App;
