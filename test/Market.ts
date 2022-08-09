import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const { upgrades } = require("hardhat");



const MaxUint256 = ethers.BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

describe("Templar Hero", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const TemToken = await ethers.getContractFactory("TemToken");
    const tem = await TemToken.deploy()

    const Hero = await ethers.getContractFactory("TemplarHero");
    const hero = await Hero.deploy(100, tem.address);

    const Market = await ethers.getContractFactory("Market")
    const instance = await upgrades.deployProxy(Market, [tem.address, hero.address]);
    await instance.deployed();

    await tem.approve(hero.address, MaxUint256);

    // mint nfts
    const mintAmount = 6;
    await hero.requestNewRandomHero(mintAmount)

    expect(await hero.totalSupply()).to.equal(mintAmount)

    return { market: instance, tem, hero, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      await loadFixture(deployFixture);
    });
  });

  describe("Market", function () {
    it("Should open trades", async function () {
      const { market, hero, tem, owner } = await loadFixture(deployFixture);

      await hero.setApprovalForAll(market.address, true)
      await market.openTrade(1, ethers.utils.parseEther('1'))

      await market.openTrade(2, ethers.utils.parseEther('100'))

      const trade = await market.getTrade(1)
      expect(trade[2]).to.equal('100000000000000000000')
      const trades = await market.fetchAvailableMarketItems()
      expect(trades.length).to.equal(2)

      console.log(await hero.isApprovedForAll(owner.address, market.address))

    });

  });
});
