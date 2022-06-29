//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Distance {
    uint256 public d;
    event Log(address indexed sender, string message);
    function getDistance() view public returns(uint256){
        return d;
    }
}
