const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    const InterviewToken = await hre.ethers.getContractFactory("InterviewToken");
    const contract = await InterviewToken.deploy(deployer.address);

    await contract.waitForDeployment();
    
    console.log("Token Contract deployed at:", await contract.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
