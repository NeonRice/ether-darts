const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    },
    kovan: {
      provider: () => new HDWalletProvider(['b44e1e7b9f2dcd4764f59a323cb0e1f56864949144ac39d7913c36ec24b20b8e'], 'https://kovan.infura.io/v3/b6187a1635fa4562923ef0771fa154f9'),
      network_id: '42',  
      confirmations: 2,  
      timeoutBlocks: 200,
      skipDryRun: true
    },
  }
};
