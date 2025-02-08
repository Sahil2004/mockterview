// deploy.js (corrected)
const hre = require("hardhat");

async function main() {
  const [deployer, fundingWallet] = await hre.ethers.getSigners();

  console.log("Deploying with account:", deployer.address);
  console.log("Funding wallet:", fundingWallet.address); // Must be Hardhat Account #1 (0x7099...)

  const InterviewToken = await hre.ethers.getContractFactory("InterviewToken");
  const contract = await InterviewToken.deploy(
    deployer.address,
    fundingWallet.address // Pass the correct funding wallet address
  );

  await contract.waitForDeployment();
  console.log("Token Contract deployed at:", await contract.getAddress());

  // Verify minting
  const balance = await contract.balanceOf(fundingWallet.address);
  console.log("Funding Wallet Balance:", ethers.formatUnits(balance, 18));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });