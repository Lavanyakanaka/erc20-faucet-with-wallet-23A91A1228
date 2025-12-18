// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FaucetToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10 ** 18; // 1 million tokens
    address public minter;

    event MinterChanged(address indexed newMinter);

    modifier onlyMinter() {
        require(msg.sender == minter, "Only minter can call this function");
        _;
    }

    constructor() ERC20("Faucet Token", "FAU") {
        minter = msg.sender;
    }

    function setMinter(address newMinter) external onlyOwner {
        require(newMinter != address(0), "Minter cannot be zero address");
        minter = newMinter;
        emit MinterChanged(newMinter);
    }

    function mint(address to, uint256 amount) external onlyMinter {
        require(to != address(0), "Cannot mint to zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
