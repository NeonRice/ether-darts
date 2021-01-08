pragma solidity >=0.4.22 <0.8.0;

import "./Ownable.sol";

contract Darts is Ownable{
    uint private randNonce = 0;
    bool private correctChoice;
    mapping(address => uint) public lastUserWinning;

    constructor() public {
        generateNextCorrectChoice();
    }

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

    function donate() external payable {
    }

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

    // I won't scam you, I promise !!!
    function retrieveEther(uint _amount) external onlyOwner returns (uint){
        if (_amount > address(this).balance) {
            _amount = address(this).balance;
            msg.sender.transfer(_amount);
            return _amount;
        }
        msg.sender.transfer(_amount);
        return _amount;
    }

    // Retrieving contract balance
    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }

    // Retrieving last user winnings
    function getLastWinning() external view returns (uint) {
        return lastUserWinning[msg.sender];
    }
}