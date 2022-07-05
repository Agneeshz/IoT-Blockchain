//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Distance {
    uint256 threshold = 3;
    function getDistance(uint256 dis) view public returns(bool flag){
        if(dis<threshold)
            return true;
    }
}
