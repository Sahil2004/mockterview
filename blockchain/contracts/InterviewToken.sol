// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InterviewToken is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("InterviewToken", "IVT") // ✅ Pass name & symbol to ERC20 constructor
        Ownable(initialOwner) // ✅ Pass the initial owner to Ownable constructor
    {
        _mint(initialOwner, 1000000 * 10 ** decimals()); // Mint 1M tokens to the owner
    }
}
