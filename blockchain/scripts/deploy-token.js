const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners(); // Get the deployer account

    const InterviewToken = await hre.ethers.getContractFactory("InterviewToken");
    const contract = await InterviewToken.deploy(deployer.address); // ✅ Pass deployer as initialOwner

    await contract.waitForDeployment(); // ✅ Use waitForDeployment() instead of deployed()
    
    console.log("Token Contract deployed at:", await contract.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
