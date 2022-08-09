import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

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

    await tem.approve(hero.address, MaxUint256);

    return { tem, hero, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      await loadFixture(deployFixture);
    });
  });

  describe("Random new Hero", function () {
    it("Should mint hero1", async function () {
      const { hero, tem, owner } = await loadFixture(deployFixture);

      const mintAmount = 6;
      await hero.requestNewRandomHero(mintAmount)

      expect(await hero.totalSupply()).to.equal(mintAmount)
      // expect(await tem.balanceOf(owner.address)).to.equal(ethers.utils.parseEther('999'))


      // console.log('Overview 1 = ', await hero.getCharacterOverview(0))
      // console.log('Overview 2 = ', await hero.getCharacterOverview(1))
      // console.log('Overview 3 = ', await hero.getCharacterOverview(2))
      // console.log('Overview 4 = ', await hero.getCharacterOverview(3))
      // console.log('Overview 5 = ', await hero.getCharacterOverview(4))
      // console.log('Overview 6 = ', await hero.getCharacterOverview(5))

      // console.log(await hero.totalSupply());
    });

    it("Should mint hero2", async function () {

      const { hero } = await loadFixture(deployFixture);
      await hero.requestNewRandomHero(1)

    });
  });
});
