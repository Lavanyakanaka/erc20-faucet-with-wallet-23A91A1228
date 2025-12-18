// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract TokenFaucet is ReentrancyGuard {
    IERC20 public token;
    address public admin;
    
    uint256 public constant FAUCET_AMOUNT = 100 * 10 ** 18; // 100 tokens
    uint256 public constant COOLDOWN_TIME = 24 hours;
    uint256 public constant MAX_CLAIM_AMOUNT = 5000 * 10 ** 18; // 5000 tokens lifetime

    mapping(address => uint256) public lastClaimAt;
    mapping(address => uint256) public totalClaimed;
    bool public paused;

    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetPaused(bool paused);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Faucet is paused");
        _;
    }

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
        admin = msg.sender;
        paused = false;
    }

    function requestTokens() external nonReentrant whenNotPaused {
        require(canClaim(msg.sender), "Cannot claim at this time");
        require(remainingAllowance(msg.sender) >= FAUCET_AMOUNT, "Insufficient allowance");
        require(token.balanceOf(address(this)) >= FAUCET_AMOUNT, "Faucet has insufficient balance");

        lastClaimAt[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += FAUCET_AMOUNT;

        require(token.transfer(msg.sender, FAUCET_AMOUNT), "Transfer failed");
        emit TokensClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }

    function canClaim(address user) public view returns (bool) {
        if (paused) return false;
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return false;
        if (block.timestamp < lastClaimAt[user] + COOLDOWN_TIME) return false;
        return true;
    }

    function remainingAllowance(address user) public view returns (uint256) {
        uint256 claimed = totalClaimed[user];
        if (claimed >= MAX_CLAIM_AMOUNT) return 0;
        return MAX_CLAIM_AMOUNT - claimed;
    }

    function isPaused() public view returns (bool) {
        return paused;
    }

    function setPaused(bool _paused) external onlyAdmin {
        paused = _paused;
        emit FaucetPaused(_paused);
    }

    function withdraw(uint256 amount) external onlyAdmin {
        require(token.transfer(admin, amount), "Withdraw failed");
    }
}
