/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY = "500bdb809dc33163565ff6461a586bf890b201bd37b67bfdc0e4523651327d54";
const RPC_URL = "https://rpc.ankr.com/eth_sepolia";
module.exports = {
  defaultNetwork: "eth_sepolia",
  networks: {
    hardhat: {
    },
    eth_sepolia: {
      url: "https://rpc.ankr.com/eth_sepolia",
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
