//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract IoT {
    uint256 _threshold = 3;

    function getDistance(uint256 _dis) public view returns (bool flag) {
        if (_dis < _threshold) return true;
    }

    function flameDetect() public pure returns (bool inspect) {
        return true;
    }
}
