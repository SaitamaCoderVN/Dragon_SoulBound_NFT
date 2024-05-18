// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";

contract ShitCoin is ERC20, ERC20Permit, ERC20FlashMint {
    constructor(uint256 initialSupply) ERC20("ShitCoin", "SC") ERC20Permit("ShitCoin") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}
