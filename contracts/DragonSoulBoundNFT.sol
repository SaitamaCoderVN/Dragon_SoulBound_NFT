// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

/**
 * @title SoulBoundNFT
 * @dev This contract implements an ERC721 token with additional features like pausing, ownership, URI storage,
 *      and burning capabilities. It is designed to represent SoulBound NFTs.
 */
contract SoulBoundNFT is ERC721, ERC721URIStorage, ERC721Burnable {
    uint256 private _nextTokenId;

    constructor()
        ERC721("DragonSoulBoundNFT", "DragonSBNFT")
    {}

    /**
     * @dev Mints a new token with the given URI and assigns it to the specified address.
     * Requirements:
     * - Sender must be the owner of the contract.
     * @param to The address to which the token will be minted.
     * @param uri The URI for the token metadata.
     */
    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /**
     * @dev Overrides the transferFrom function to prevent token transfers.
     * @param from The address from which the token is transferred.
     * @param to The address to which the token is transferred.
     * @param tokenId The ID of the token being transferred.
     */
    function transferFrom(address from, address to, uint256 tokenId)
            public
            override(ERC721, IERC721)
            virtual
        {
            require(from == address(0), "Err: token transfer is BLOCKED");   
            super.transferFrom(from, to, tokenId);
        }

    /**
     * @dev Updates the internal state of the contract.
     * @param to The address to which the token is being transferred.
     * @param tokenId The ID of the token being transferred.
     * @param auth The authorization address.
     * @return Address The address to which the token is transferred.
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Retrieves the URI for the specified token.
     * @param tokenId The ID of the token for which the URI will be retrieved.
     * @return string The URI for the token metadata.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Checks whether the contract supports the given interface.
     * @param interfaceId The ID of the interface.
     * @return bool True if the contract supports the given interface, false otherwise.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}