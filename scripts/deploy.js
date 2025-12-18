async function main() {
  console.log("Starting deployment...");
  
  // Deploy Token
  const Token = await ethers.getContractFactory("FaucetToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("Token deployed to:", tokenAddress);
  
  // Deploy TokenFaucet
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  const faucet = await Faucet.deploy(tokenAddress);
  await faucet.waitForDeployment();
  const faucetAddress = await faucet.getAddress();
  console.log("TokenFaucet deployed to:", faucetAddress);
  
  // Set minter to faucet
  await token.setMinter(faucetAddress);
  console.log("Minter role set to faucet contract");
  
  // Mint initial tokens to faucet
  await token.mint(faucetAddress, ethers.parseEther("100000"));
  console.log("Minted 100000 tokens to faucet");
  
  console.log("\nDeployment Summary:");
  console.log("Token Address:", tokenAddress);
  console.log("Faucet Address:", faucetAddress);
  
  // Save to file
  const fs = require('fs');
  fs.writeFileSync(
    'deploymentAddresses.json',
    JSON.stringify({
      token: tokenAddress,
      faucet: faucetAddress,
      network: hre.network.name,
      timestamp: new Date().toISOString()
    }, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
