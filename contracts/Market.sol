// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// Import this file to use console.log
import "hardhat/console.sol";

contract Market is Initializable {
    event TradeStatusChange(uint256 ad, bytes32 status);

    IERC20 currencyToken;
    IERC721 itemToken;

    struct Trade {
        uint256 index;
        address poster;
        uint256 item;
        uint256 price;
        bytes32 status; // Open, Executed, Cancelled
    }
    mapping(uint256 => Trade) private _trades;

    uint256 tradeCounter;
    uint256 soldItemsCounter;
    uint256 canceledItemsCounter;

    function initialize(
        address _currencyTokenAddress,
        address _itemTokenAddress
    ) public initializer {
        currencyToken = IERC20(_currencyTokenAddress);
        itemToken = IERC721(_itemTokenAddress);
        tradeCounter = 0;
        soldItemsCounter = 0;
        canceledItemsCounter = 0;
    }

    constructor() {}

    /**
     * @dev Returns the details for a trade.
     * @param _trade The id for the trade.
     */
    function getTrade(uint256 _trade)
        public
        view
        returns (
            address,
            uint256,
            uint256,
            bytes32,
            uint256
        )
    {
        Trade memory trade = _trades[_trade];
        return (
            trade.poster,
            trade.item,
            trade.price,
            trade.status,
            trade.index
        );
    }

    /**
     * @dev Opens a new trade. Puts _item in escrow.
     * @param _item The id for the item to trade.
     * @param _price The amount of currency for which to trade the item.
     */
    function openTrade(uint256 _item, uint256 _price) public {
        itemToken.transferFrom(msg.sender, address(this), _item);
        _trades[tradeCounter] = Trade({
            index: tradeCounter,
            poster: msg.sender,
            item: _item,
            price: _price,
            status: "Open"
        });
        tradeCounter += 1;
        emit TradeStatusChange(tradeCounter - 1, "Open");
    }

    /**
     * @dev Executes a trade. Must have approved this contract to transfer the
     * amount of currency specified to the poster. Transfers ownership of the
     * item to the filler.
     * @param _trade The id of an existing trade
     */
    function executeTrade(uint256 _trade) public {
        Trade memory trade = _trades[_trade];
        require(trade.status == "Open", "Trade is not Open.");
        currencyToken.transferFrom(msg.sender, trade.poster, trade.price);
        itemToken.transferFrom(address(this), msg.sender, trade.item);
        _trades[_trade].status = "Executed";
        soldItemsCounter += 1;
        emit TradeStatusChange(_trade, "Executed");
    }

    /**
     * @dev Cancels a trade by the poster.
     * @param _trade The trade to be cancelled.
     */
    function cancelTrade(uint256 _trade) public {
        Trade memory trade = _trades[_trade];
        require(
            msg.sender == trade.poster,
            "Trade can be cancelled only by poster."
        );
        require(trade.status == "Open", "Trade is not Open.");
        itemToken.transferFrom(address(this), trade.poster, trade.item);
        _trades[_trade].status = "Cancelled";
        canceledItemsCounter += 1;
        emit TradeStatusChange(_trade, "Cancelled");
    }

    function fetchAvailableMarketItems() public view returns (Trade[] memory) {
        uint256 availableItemsCount = tradeCounter -
            soldItemsCounter -
            canceledItemsCounter;

        Trade[] memory marketItems = new Trade[](availableItemsCount);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < tradeCounter; i++) {
            Trade memory trade = _trades[i];
            if (trade.status != "Open") continue;
            marketItems[currentIndex] = trade;
            currentIndex += 1;
        }

        return marketItems;
    }
}
