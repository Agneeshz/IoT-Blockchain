//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";


contract Distance {
    uint256 _threshold = 3;
    function getDistance(uint256 _dis) view public returns(bool flag){
        if(_dis<_threshold)
            return true;
    }
}