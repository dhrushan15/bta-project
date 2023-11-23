/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle")

module.exports = {
  solidity: "0.8.0",
  networks : {
    sepolia : {
      url :"https://eth-sepolia.g.alchemy.com/v2/AR8dMFBKtcXA47kpiXl7Spc6yLmteV6_",
      accounts : ['a23d3cffc24cb3583c6ebf41d813c904c86c583d9b38c213011e820fb9470915'],
    }
  }
  
};
