import { ethers, network } from "hardhat";
import { Signer, BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";

describe("Staking contract", function () {

    let lpToken: Contract;
    let rewardToken: Contract;
    let staking: Contract;
    let owner: SignerWithAddress;
    let signers: SignerWithAddress[];

    beforeEach(async function () {
        [owner, ...signers] = await ethers.getSigners();

        let Token = await ethers.getContractFactory("Token");

        lpToken = await Token.deploy();
        await lpToken.deployed();

        rewardToken = await Token.deploy();
        await rewardToken.deployed();

        let Staking = await ethers.getContractFactory("Staking");
        staking = await Staking.deploy(lpToken.address, rewardToken.address, 10*60, 3);
        await staking.deployed();

        await rewardToken.connect(owner).mint(staking.address, 150);
        await lpToken.connect(owner).mint(signers[0].address, 30);
        await lpToken.connect(owner).mint(signers[1].address, 200);
    });

    describe("Test stake", function () {
        it("Should fail if sender doesn't have enough tokens", async function () {
            await expect(
                staking.connect(signers[0]).stake(31)
            ).to.be.revertedWith("Account doesn't have enough tokens");
        });

        it("Should fail if sender doesn't have enough allowance", async function () {
            await lpToken.connect(signers[0]).approve(staking.address, 10);

            await expect(
                staking.connect(signers[0]).stake(11)
            ).to.be.revertedWith("Account don't have enough allowance");
        });

        it("Should stake if happy pass", async function () {
            await lpToken.connect(signers[0]).approve(staking.address, 10);
            await staking.connect(signers[0]).stake(10);
            expect(await lpToken.balanceOf(signers[0].address)).to.equal(20);
            expect(await lpToken.balanceOf(staking.address)).to.equal(10);
        });
    });

    describe("Test unstake", function () {
        it("Should unstake if happy pass", async function () {
            await lpToken.connect(signers[0]).approve(staking.address, 10);
            await staking.connect(signers[0]).stake(10);
            expect(await lpToken.balanceOf(signers[0].address)).to.equal(20);
            expect(await lpToken.balanceOf(staking.address)).to.equal(10);

            await staking.connect(signers[0]).unstake();
            expect(await lpToken.balanceOf(signers[0].address)).to.equal(30);
            expect(await lpToken.balanceOf(staking.address)).to.equal(0);
        });

        it("Should not unstake twice", async function () {
            await lpToken.connect(signers[0]).approve(staking.address, 10);
            await staking.connect(signers[0]).stake(10);

            await staking.connect(signers[0]).unstake();
            await staking.connect(signers[0]).unstake();
            expect(await lpToken.balanceOf(signers[0].address)).to.equal(30);
            expect(await lpToken.balanceOf(staking.address)).to.equal(0);
        });
    });

    describe("Test claim", function () {
        it("Should claim if happy pass", async function () {
            await lpToken.connect(signers[1]).approve(staking.address, 100);
            await staking.connect(signers[1]).stake(100);

            await network.provider.send("evm_increaseTime", [60 * 60]);

            await staking.connect(signers[1]).claim();

            expect(await rewardToken.balanceOf(signers[1].address)).to.equal(18);
        });

        it("Should claim correct if stake, stacke, unstake", async function () {
            await lpToken.connect(signers[1]).approve(staking.address, 200);

            await staking.connect(signers[1]).stake(100);
            await network.provider.send("evm_increaseTime", [60 * 60]); // +18 reward
            await staking.connect(signers[1]).stake(100);
            await network.provider.send("evm_increaseTime", [30 * 60]); // +18 reward
            await staking.connect(signers[1]).unstake();
            await network.provider.send("evm_increaseTime", [24 * 60 * 60]); // +0 reward

            await staking.connect(signers[1]).claim();

            expect(await rewardToken.balanceOf(signers[1].address)).to.equal(36);
        });
    });
});