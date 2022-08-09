// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "hardhat/console.sol";

import "./ERC721r.sol";

contract TemplarHero is ERC721r {
    mapping(uint => uint) private _availableTokens;
    uint256 private _numAvailableTokens;

    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 erc20;
    uint256 private _price = 500000000000000000;

    constructor(uint maxSupply_, address erc20Address)
        ERC721("Templar Hero", "TEMHero")
        ERC721r(maxSupply_)
    {
        erc20 = IERC20(erc20Address);
    }

    function requestNewRandomHero(uint quantity) public {
        require(
            erc20.balanceOf(msg.sender) > _price.mul(quantity),
            "Tem amount is not enough"
        );

        erc20.safeTransferFrom(msg.sender, address(this), _price.mul(quantity));
        _mintRandom(msg.sender, quantity);
    }

    function getCharacterOverview(uint256 tokenId)
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            characters[tokenId].background,
            characters[tokenId].weapon,
            characters[tokenId].body,
            characters[tokenId].armor,
            characters[tokenId].mouth,
            characters[tokenId].eyes,
            characters[tokenId].head
        );
    }
}
