// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "hardhat/console.sol";

abstract contract ERC721r is ERC721, ERC721URIStorage, ERC721Enumerable {
    mapping(uint => uint) private _availableTokens;
    uint256 private _numAvailableTokens;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    using Math for uint256;

    struct Character {
        uint256 background;
        uint256 weapon;
        uint256 body;
        uint256 armor;
        uint256 mouth;
        uint256 eyes;
        uint256 head;
    }

    Character[] public characters;

    constructor(uint maxSupply_) {
        _numAvailableTokens = maxSupply_;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _mintRandom(address to, uint _numToMint) internal virtual {
        require(_msgSender() == tx.origin, "Contracts cannot mint");
        require(to != address(0), "ERC721: mint to the zero address");
        require(_numToMint > 0, "ERC721: need to mint at least one token");

        require(
            _numAvailableTokens >= _numToMint,
            "ERC721: minting more tokens than available"
        );

        uint updatedNumAvailableTokens = _numAvailableTokens;
        for (uint256 i; i < _numToMint; ++i) {
            _mint(to, _tokenIds.current());

            uint256 backgroundRandomNumber = getRandomAvailableTokenId(
                to,
                updatedNumAvailableTokens
            );
            uint256 weaponRandomNumber = getRandomAvailableTokenId(
                to,
                updatedNumAvailableTokens + 1
            );
            uint256 bodyRandomNumber = getRandomAvailableTokenId(
                to,
                updatedNumAvailableTokens + 2
            );
            uint256 armorRandomNumber = getRandomAvailableTokenId(
                to,
                updatedNumAvailableTokens + 3
            );
            uint256 mouthRandomNumber = getRandomAvailableTokenId(
                to,
                updatedNumAvailableTokens + 4
            );
            uint256 eyesRandomNumber = getRandomAvailableTokenId(
                to,
                updatedNumAvailableTokens + 5
            );
            uint256 headRandomNumber = getRandomAvailableTokenId(
                to,
                updatedNumAvailableTokens + 6
            );

            uint256 background = ((backgroundRandomNumber) % 5);
            uint256 weapon = ((weaponRandomNumber) % 5);
            uint256 body = ((bodyRandomNumber) % 5);
            uint256 armor = ((armorRandomNumber) % 5);
            uint256 mouth = ((mouthRandomNumber) % 5);
            uint256 eyes = ((eyesRandomNumber) % 5);
            uint256 head = ((headRandomNumber) % 5);

            characters.push(
                Character(background, weapon, body, armor, mouth, eyes, head)
            );

            _numAvailableTokens = _numAvailableTokens - _tokenIds.current();
            _tokenIds.increment();
        }

        _numAvailableTokens = updatedNumAvailableTokens;
    }

    function getRandomAvailableTokenId(
        address to,
        uint updatedNumAvailableTokens
    ) internal returns (uint256) {
        uint256 randomNum = uint256(
            keccak256(
                abi.encode(
                    to,
                    tx.gasprice,
                    block.number,
                    block.timestamp,
                    block.difficulty,
                    blockhash(block.number - 1),
                    address(this),
                    updatedNumAvailableTokens
                )
            )
        );

        uint256 randomIndex = randomNum % updatedNumAvailableTokens;
        return getAvailableTokenAtIndex(randomIndex, updatedNumAvailableTokens);
    }

    // Implements https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle. Code taken from CryptoPhunksV2
    function getAvailableTokenAtIndex(
        uint256 indexToUse,
        uint updatedNumAvailableTokens
    ) internal returns (uint256) {
        uint256 valAtIndex = _availableTokens[indexToUse];
        uint256 result;
        if (valAtIndex == 0) {
            // This means the index itself is still an available token
            result = indexToUse;
        } else {
            // This means the index itself is not an available token, but the val at that index is.
            result = valAtIndex;
        }

        uint256 lastIndex = updatedNumAvailableTokens - 1;
        if (indexToUse != lastIndex) {
            // Replace the value at indexToUse, now that it's been used.
            // Replace it with the data from the last index in the array, since we are going to decrease the array size afterwards.
            uint256 lastValInArray = _availableTokens[lastIndex];
            if (lastValInArray == 0) {
                // This means the index itself is still an available token
                _availableTokens[indexToUse] = lastIndex;
            } else {
                // This means the index itself is not an available token, but the val at that index is.
                _availableTokens[indexToUse] = lastValInArray;
                // Gas refund courtsey of @dievardump
                delete _availableTokens[lastIndex];
            }
        }

        return result;
    }
}
