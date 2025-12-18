# ERC-20 Token Faucet DApp

A complete, production-ready decentralized application (DApp) that demonstrates end-to-end Web3 development. This project implements a token faucet with rate limiting, wallet integration, and comprehensive testing.

## Features

- **ERC-20 Token**: Fully compliant ERC-20 token with fixed maximum supply
- **Faucet Mechanism**: Rate-limited token distribution with 24-hour cooldown per address
- **Lifetime Limits**: Each address has a maximum lifetime claim amount
- **Admin Controls**: Pause/unpause functionality for the faucet
- **Frontend Interface**: Modern React UI with MetaMask integration
- **Evaluation Interface**: `window.__EVAL__` object for automated testing
- **Docker Support**: Fully containerized application
- **Smart Contract Testing**: Comprehensive test suite with Hardhat

## Deployment Information

### Sepolia Testnet Contracts
- **Token Address**: [Will be updated after deployment]
- **Faucet Address**: [Will be updated after deployment]

## Project Structure

```
submission/
├── contracts/
│   ├── Token.sol                 # ERC-20 token implementation
│   ├── TokenFaucet.sol          # Faucet with rate limiting
│   └── test/
│       └── TokenFaucet.test.js  # Comprehensive test suite
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main application component
│   │   ├── components/          # React components
│   │   ├── utils/
│   │   │   ├── wallet.js        # Wallet connection logic
│   │   │   ├── contracts.js     # Contract interaction
│   │   │   └── eval.js          # Evaluation interface
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   └── .dockerignore
├── scripts/
│   └── deploy.js                # Deployment script
├── docker-compose.yml
├── .env.example
├── hardhat.config.js
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH for deployment

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   # Edit .env with your Infura key and other settings
   ```

3. **Deploy contracts**:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Start frontend development server**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Update environment variables** with deployed contract addresses

### Docker Deployment

```bash
# Build and start the application
docker compose up

# Application will be available at http://localhost:3000
```

## Smart Contract Details

### Token.sol
ERC-20 compliant token with:
- Fixed maximum supply
- Minting restricted to faucet contract
- Transfer event emissions

### TokenFaucet.sol
Faucet contract with:
- **FAUCET_AMOUNT**: 100 tokens per claim
- **COOLDOWN_TIME**: 24 hours between claims
- **MAX_CLAIM_AMOUNT**: 5000 tokens lifetime per address
- Admin-only pause/unpause functionality
- Public functions:
  - `requestTokens()`: Claim tokens
  - `canClaim(address)`: Check eligibility
  - `remainingAllowance(address)`: Check lifetime remaining
  - `isPaused()`: Check faucet status

## Frontend Features

- **Wallet Connection**: Connect/disconnect MetaMask
- **Real-time Balance Display**: Shows connected wallet token balance
- **Claim Status**: Displays cooldown timer and claim eligibility
- **Lifetime Allowance**: Shows remaining claimable tokens
- **Error Handling**: User-friendly error messages
- **Loading States**: Transaction progress indicators

## Evaluation Interface

The frontend exposes `window.__EVAL__` with the following functions:

```javascript
window.__EVAL__ = {
  connectWallet()           // Returns connected address as string
  requestTokens()           // Returns transaction hash as string
  getBalance(address)       // Returns balance as string
  canClaim(address)         // Returns boolean
  getRemainingAllowance(address)  // Returns remaining allowance as string
  getContractAddresses()    // Returns {token: "0x...", faucet: "0x..."}
}
```

## Testing

```bash
# Run smart contract tests
npx hardhat test

# Run with coverage report
npx hardhat coverage
```

Test coverage includes:
- Token deployment and initial state
- Faucet deployment and configuration
- Successful token claims
- Cooldown period enforcement
- Lifetime limit enforcement
- Pause mechanism
- Admin-only functions
- Event emissions
- Edge cases and error conditions

## Security Considerations

- Uses OpenZeppelin audited ERC-20 implementation
- Implements checks-effects-interactions pattern
- ReentrancyGuard protection on sensitive functions
- Access control for admin functions
- Clear error messages for failed transactions
- Gas-optimized storage layout

## Design Decisions

### Faucet Amount: 100 tokens
- Reasonable claim size for user testing
- Prevents token depletion too quickly
- Allows multiple test transactions per user

### Cooldown Period: 24 hours
- Prevents abuse and spam
- Standard for faucet mechanisms
- Can be verified using Hardhat's time manipulation

### Lifetime Limit: 5000 tokens
- Allows 50 claims per address
- Reasonable for testing scenarios
- Prevents single address from draining faucet

## Deployment Checklist

- [ ] Deploy Token contract to Sepolia
- [ ] Grant minting role to faucet in token
- [ ] Deploy TokenFaucet with token address
- [ ] Verify contracts on Etherscan
- [ ] Test all functionality on testnet
- [ ] Build Docker image
- [ ] Test Docker container startup
- [ ] Verify health endpoint
- [ ] Document contract addresses

## Common Issues and Solutions

**Issue**: MetaMask not connecting
- Solution: Ensure MetaMask is installed and on Sepolia network

**Issue**: Insufficient gas
- Solution: Add more Sepolia ETH from faucet

**Issue**: Contract deployment fails
- Solution: Check private key and RPC URL in .env file

**Issue**: Docker container won't start
- Solution: Check port 3000 is available, review logs with `docker compose logs`

## Environment Variables

```
VITE_RPC_URL=                 # Sepolia RPC endpoint
VITE_TOKEN_ADDRESS=           # Deployed token contract address
VITE_FAUCET_ADDRESS=          # Deployed faucet contract address
SEPOLIA_PRIVATE_KEY=          # Private key for deployment
EVERIFY_API_KEY=              # Etherscan API key for verification
```

## Future Improvements

- Multi-chain support
- Advanced analytics dashboard
- Referral bonus system
- Multiple token types
- Governance token features

## License

MIT

## Support

For issues or questions, please open an issue on the GitHub repository.
