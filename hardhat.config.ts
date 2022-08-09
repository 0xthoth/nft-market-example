import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import { resolve } from "path";

import { AbiExporterUserConfig } from 'hardhat-abi-exporter'

require('@nomiclabs/hardhat-ethers');
require('hardhat-abi-exporter');
require('@openzeppelin/hardhat-upgrades');

import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: resolve(__dirname, "./.env") });

dotenv.config();

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY || "";

const config: HardhatUserConfig & AbiExporterUserConfig = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [RINKEBY_PRIVATE_KEY],
      allowUnlimitedContractSize: true
    },
  },
  abiExporter: {
    path: "./frontend/src/abi",
    clear: false,
    flat: true,
  }
};

export default config;
