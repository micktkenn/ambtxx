// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Mock escrow contract for frontend/backend integration planning only.
/// Production contract requires full security review and tests.
contract AMLBTMockEscrow {
    enum TradeStatus { Created, Funded, Released, Refunded, Disputed, Resolved }

    struct Trade {
        address buyer;
        address seller;
        address token;
        uint256 amount;
        TradeStatus status;
    }

    mapping(bytes32 => Trade) public trades;

    event TradeCreated(bytes32 indexed tradeId, address indexed buyer, address indexed seller, address token, uint256 amount);
    event TradeFunded(bytes32 indexed tradeId);
    event TradeReleased(bytes32 indexed tradeId);
    event TradeRefunded(bytes32 indexed tradeId);
    event TradeDisputed(bytes32 indexed tradeId);
    event TradeResolved(bytes32 indexed tradeId, address recipient);

    function createTrade(bytes32 tradeId, address buyer, address seller, address token, uint256 amount) external {
        require(trades[tradeId].amount == 0, "TRADE_EXISTS");
        trades[tradeId] = Trade(buyer, seller, token, amount, TradeStatus.Created);
        emit TradeCreated(tradeId, buyer, seller, token, amount);
    }
}
