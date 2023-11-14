const { ethers } = require("hardhat");

async function main() {
  // Compile the contract
  const IdentityManagement = await ethers.getContractFactory("IdentityManagement");
  
  // Deploy the contract
  const identityManagement = await IdentityManagement.deploy();
  await identityManagement.deployed();

  console.log("IdentityManagement contract deployed to:", identityManagement.address);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });