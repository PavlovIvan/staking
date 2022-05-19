import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", owner.address);

    const Token = await ethers.getContractFactory("Token");

    const lpToken = await Token.deploy();
    await lpToken.deployed();
    console.log("LP token deployed to: ", lpToken.address);

    const rewardToken = await Token.deploy();
    await rewardToken.deployed();
    console.log("reward token deployed to: ", rewardToken.address);

    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(lpToken.address, rewardToken.address, 24*60*60, 1);
    await staking.deployed();
    console.log("Staking deployed to: ", staking.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
