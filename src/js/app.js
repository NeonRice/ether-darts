App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    return await App.initWeb3();
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Darts.json", function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var DartsArtifact = data;
      App.contracts.Darts = TruffleContract(DartsArtifact);

      // Set the provider for our contract
      App.contracts.Darts.setProvider(App.web3Provider);
      
      return App.updateInfo();
    }).then(function () {
      return App.initPage();
    });
  },

  initPage: function () {
    return App.bindEvents();
  },

  updateInfo: function() {
    var dartInstance;

    App.contracts.Darts.deployed()
      .then(function (instance) {
        dartInstance = instance;
        return dartInstance.getContractBalance.call();
      })
      .then(function (balance) {
        document.getElementById("contract-balance").innerHTML = web3.fromWei(balance);
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  bindEvents: function () {
    $("#board1").on("click", function () {
      let betAmount = prompt("Enter how much you want to bet:", 1);
      App.handleChoice(betAmount, false);
    });
    $("#board2").on("click", function () {
      let betAmount = prompt("Enter how much you want to bet:", 1);
      App.handleChoice(betAmount, true);
    });
    $("#donate").on("click", function () {
      let donateAmount = prompt("Enter how much you want to donate:", 10);
      App.handleDonate(donateAmount);
    });
  },

  showResult: function (result) {
    var dartsInstance;

    App.contracts.Darts.deployed()
      .then(function (instance) {
        dartsInstance = instance;

        return dartsInstance.getLastWinning.call();
      })
      .then(function (winning) {
        console.log(winning);
        if (winning > 0) {
          alert("Go buy everyone a drink, you won " + web3.fromWei(winning) + "ETH");
        } else {
          alert("Ah shoot.. Better buy a drink with the rest of your money! You lost");
        }
        App.updateInfo();
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  handleChoice: function (betAmount, choice) {
    var dartInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Darts.deployed()
        .then(function (instance) {
          dartInstance = instance;
          console.log(choice);
          return dartInstance.pick(choice, {
            from: account,
            value: web3.toWei(betAmount, "ether"),
          });
        })
        .then(function (result) {
          return App.showResult(result);
        })
        .catch(function (err) {
          console.log(err.message);
        });
    });
  },

  handleDonate: function (betAmount) {
    let donateInstance;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Darts.deployed()
        .then(function (instance) {
          donateInstance = instance;
          return donateInstance.donate({
            from: account,
            value: web3.toWei(betAmount, "ether"),
          });
        })
        .then(function (result) {
          alert("Thanks for restocking us!");
          return App.updateInfo();
        })
        .catch(function (err) {
          console.log(err.message);
        });
    });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
