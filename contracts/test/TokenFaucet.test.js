const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("TokenFaucet", function () {
  let token, faucet, owner, addr1, addr2;
  const FAUCET_AMOUNT = ethers.parseEther("100");
  const MAX_CLAIM = ethers.parseEther("5000");
  const COOLDOWN = 24 * 60 * 60;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("FaucetToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    const Faucet = await ethers.getContractFactory("TokenFaucet");
    faucet = await Faucet.deploy(await token.getAddress());
    await faucet.waitForDeployment();

    await token.setMinter(await faucet.getAddress());
  });

  describe("Deployment", function () {
    it("Should deploy token and faucet correctly", async function () {
      expect(await token.getAddress()).to.not.equal(ethers.ZeroAddress);
      expect(await faucet.getAddress()).to.not.equal(ethers.ZeroAddress);
    });

    it("Should set correct admin", async function () {
      expect(await faucet.admin()).to.equal(owner.address);
    });

    it("Should initialize paused as false", async function () {
      expect(await faucet.isPaused()).to.equal(false);
    });
  });

  describe("Token Claiming", function () {
    it("Should allow user to claim tokens", async function () {
      await faucet.connect(addr1).requestTokens();
      const balance = await token.balanceOf(addr1.address);
      expect(balance).to.equal(FAUCET_AMOUNT);
    });

    it("Should emit TokensClaimed event", async function () {
      await expect(faucet.connect(addr1).requestTokens())
        .to.emit(faucet, "TokensClaimed")
        .withArgs(addr1.address, FAUCET_AMOUNT, expect.any(Number));
    });

    it("Should track total claimed", async function () {
      await faucet.connect(addr1).requestTokens();
      expect(await faucet.totalClaimed(addr1.address)).to.equal(FAUCET_AMOUNT);
    });
  });

  describe("Cooldown Enforcement", function () {
    it("Should prevent immediate re-claim", async function () {
      await faucet.connect(addr1).requestTokens();
      await expect(faucet.connect(addr1).requestTokens()).to.be.reverted;
    });

    it("Should allow claim after cooldown", async function () {
      await faucet.connect(addr1).requestTokens();
      await time.increase(COOLDOWN);
      await expect(faucet.connect(addr1).requestTokens()).to.not.be.reverted;
    });

    it("Should return correct canClaim status", async function () {
      expect(await faucet.canClaim(addr1.address)).to.equal(true);
      await faucet.connect(addr1).requestTokens();
      expect(await faucet.canClaim(addr1.address)).to.equal(false);
      await time.increase(COOLDOWN);
      expect(await faucet.canClaim(addr1.address)).to.equal(true);
    });
  });

  describe("Lifetime Limit", function () {
    it("Should enforce lifetime limit", async function () {
      const claims = Math.floor(Number(MAX_CLAIM / FAUCET_AMOUNT));
      for (let i = 0; i < claims; i++) {
        await faucet.connect(addr1).requestTokens();
        await time.increase(COOLDOWN);
      }
      await expect(faucet.connect(addr1).requestTokens()).to.be.reverted;
    });

    it("Should return correct remainingAllowance", async function () {
      expect(await faucet.remainingAllowance(addr1.address)).to.equal(MAX_CLAIM);
      await faucet.connect(addr1).requestTokens();
      expect(await faucet.remainingAllowance(addr1.address)).to.equal(MAX_CLAIM - FAUCET_AMOUNT);
    });
  });

  describe("Pause Mechanism", function () {
    it("Should prevent claims when paused", async function () {
      await faucet.setPaused(true);
      await expect(faucet.connect(addr1).requestTokens()).to.be.reverted;
    });

    it("Should allow claims when unpaused", async function () {
      await faucet.setPaused(true);
      await faucet.setPaused(false);
      await expect(faucet.connect(addr1).requestTokens()).to.not.be.reverted;
    });

    it("Should emit FaucetPaused event", async function () {
      await expect(faucet.setPaused(true))
        .to.emit(faucet, "FaucetPaused")
        .withArgs(true);
    });

    it("Should only allow admin to pause", async function () {
      await expect(faucet.connect(addr1).setPaused(true)).to.be.reverted;
    });
  });

  describe("Multiple Users", function () {
    it("Should track claims independently per address", async function () {
      await faucet.connect(addr1).requestTokens();
      await faucet.connect(addr2).requestTokens();
      expect(await token.balanceOf(addr1.address)).to.equal(FAUCET_AMOUNT);
      expect(await token.balanceOf(addr2.address)).to.equal(FAUCET_AMOUNT);
    });

    it("Should enforce cooldown independently", async function () {
      await faucet.connect(addr1).requestTokens();
      expect(await faucet.canClaim(addr2.address)).to.equal(true);
      await expect(faucet.connect(addr2).requestTokens()).to.not.be.reverted;
    });
  });
});
