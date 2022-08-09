const { ethers, upgrades } = require("hardhat");

async function market() {

  const Market = await ethers.getContractFactory("Market")

  const instance = await upgrades.deployProxy(Market, ["0xCAa07F005c249e46Bda6F6FeeE30F80B9233aCd7", "0x3ac226a1a9ddcbEE9169B1B381a103BB38dDbe40"]);
  await instance.deployed();

  console.log("TEM Token deployed to:", "0xCAa07F005c249e46Bda6F6FeeE30F80B9233aCd7");
  console.log("Templar NFT deployed to:", "0x3ac226a1a9ddcbEE9169B1B381a103BB38dDbe40");
  console.log("Market deployed to:", instance.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
market().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
