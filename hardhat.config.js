require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-verify");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.VITE_RPC_URL || "https://sepolia.infura.io/v3/YOUR_KEY",
      accounts: process.env.SEPOLIA_PRIVATE_KEY ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.EVERIFY_API_KEY || "",
  },
};
