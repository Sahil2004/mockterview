const { ethers } = require("hardhat");

async function main() {
    const InterviewCredential = await ethers.getContractFactory("InterviewCredential");
    const interviewCredential = await InterviewCredential.deploy();

    await interviewCredential.waitForDeployment();

    console.log("InterviewCredential deployed to:", await interviewCredential.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
