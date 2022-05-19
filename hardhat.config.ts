import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "solidity-coverage";
import * as dotenv from "dotenv";
import "./tasks/tasks.ts"

dotenv.config();

export default {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: process.env.RENKEBY_URL || '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
