# Ether Darts 🎯
## A simple Dapp ⧫ game for the Beer Lovers 🍻

## Ether Darts 🎯 function examples:

### Contract Constructor 👷
randNonce is used in random number generation, while correctChoice safely holds the correct choice!

generateNextCorrectChoice() is run as the contract deploys, making correctChoice unique each time.
```c++
uint private randNonce = 0;
bool private correctChoice;
mapping(address => uint) public lastUserWinning;

constructor() public {
    generateNextCorrectChoice();
}
```

### 💵 Betting function 💵
Main function, as well as entry-point to the contract. 

Accepts a bet and checks if user's choice against the generated one
```c++
function pick(bool _choice) external payable {
    uint contractBalance = address(this).balance;
    require(msg.value * 2 <= contractBalance);
    uint winningMoney = msg.value * 2;
    if (_choice == correctChoice) {
        msg.sender.transfer(winningMoney);
        lastUserWinning[msg.sender] = winningMoney;
    } else {
        lastUserWinning[msg.sender] = 0;
    }
    generateNextCorrectChoice();
}
```
### ⚠️ Random choice generation ⚠️
The function that handles our random choice generation. Generates a unique result every time.

⚠️**BEWARE!**⚠️ Deploying this contract on a network that has value associated with it is not recommended as this random choice generation poses a [vulnerability](https://ethereum.stackexchange.com/questions/191/how-can-i-securely-generate-a-random-number-in-my-smart-contract)
```c++
function generateNextCorrectChoice() private{
    uint random100 = randMod(100);
    if (random100 > 50) {
        correctChoice = true; // 1 is the correct choice
    } else {
        correctChoice = false; // 0 is the correct choice
    }
}

function randMod(uint _modulus) internal returns (uint) {
    randNonce++;
    return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % _modulus + 1;
}
```
### 🎉 Getters 🎉
All of the getters, pretty self explanatory

Free since these functions are declared as **external view**
```c++
// Retrieving contract balance
function getContractBalance() external view returns (uint) {
    return address(this).balance;
}

// Retrieving last user winnings
function getLastWinning() external view returns (uint) {
    return lastUserWinning[msg.sender];
}
```

## 👨🏾‍🏫 Using instructions for *Ether Darts* 👨🏾‍🏫
If you want to run this babe on your local-chain or on a testnet, do the following
1. npm install
2. npm run dev
3. truffle migrate
Make sure you have a smart wallet set up for the contract to work.

### ✨ Conclusions: ✨
- Using Solidity is not that hard
- Decentralized marketplaces - good! 
- Solidity gives the transparency that we all need in our lives.


