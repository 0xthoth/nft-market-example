import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const lockedAmount = ethers.utils.parseEther("1");

  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  await lock.deployed();
}


async function nft() {
  // const TemToken = await ethers.getContractFactory("TemToken");
  // const tem = await TemToken.deploy()
  // await tem.deployed();

  // const Hero = await ethers.getContractFactory("TemplarHero");
  // const hero = await Hero.deploy(100, "0xCAa07F005c249e46Bda6F6FeeE30F80B9233aCd7");
  // await hero.deployed();

  const Market = await ethers.getContractFactory("Market")
  const market = await Market.deploy("0xCAa07F005c249e46Bda6F6FeeE30F80B9233aCd7", "0x3ac226a1a9ddcbEE9169B1B381a103BB38dDbe40");
  await market.deployed();

  console.log("TEM Token deployed to:", "0xCAa07F005c249e46Bda6F6FeeE30F80B9233aCd7");
  console.log("Templar NFT deployed to:", "0x3ac226a1a9ddcbEE9169B1B381a103BB38dDbe40");
  console.log("Market deployed to:", market.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
nft().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
