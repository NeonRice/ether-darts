var Darts = artifacts.require("Darts");
var Ownable = artifacts.require("Ownable");

module.exports = function(deployer) {
  deployer.deploy(Darts);
  deployer.link(Darts, Ownable);
};