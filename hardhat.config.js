require('@nomiclabs/hardhat-ethers')
const API_URL = "https://eth-goerli.g.alchemy.com/v2/cOA5FqnMLYM3DOSMIy8hDIkLkZcYAu5n";
const PRIVATE_KEY = "db8a1e2473c15d96986f4efe600cae65874b21dfeb0372c736cc6b0b4835946a"
const PUBLIC_KEY = "0x7e835D3A034a15dE59FEffb2C50af3D12177A0EF";

require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "goerli",
  networks: {
    hardhat:{},
    goerli:{
      url: "https://eth-goerli.g.alchemy.com/v2/cOA5FqnMLYM3DOSMIy8hDIkLkZcYAu5n",
      accounts: [`0x${"db8a1e2473c15d96986f4efe600cae65874b21dfeb0372c736cc6b0b4835946a"}`]
    }
  }
};
