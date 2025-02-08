// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InterviewToken is ERC20, Ownable {
    address public fundingWallet;

    constructor(address initialOwner, address _fundingWallet)
        ERC20("InterviewToken", "IVT")
        Ownable(initialOwner)
    {
        require(_fundingWallet != address(0), "Invalid funding wallet");
        fundingWallet = _fundingWallet;
        _mint(fundingWallet, 1000000 * 10 ** decimals());
    }

    function rewardUser(address recipient, uint256 amount) external {
        require(balanceOf(fundingWallet) >= amount, "Not enough tokens");
        _transfer(fundingWallet, recipient, amount);
    }
}