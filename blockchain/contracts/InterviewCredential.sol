// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InterviewCredential is ERC721, Ownable {
    uint256 private nextTokenId;

    struct InterviewReport {
        string candidateName;
        string interviewDate;
        string feedback;
        uint8 rating; // Out of 10
    }

    mapping(uint256 => InterviewReport) public reports;

    constructor() ERC721("InterviewCredential", "IVC") Ownable(msg.sender) {}

    function mintCredential(
        address recipient,
        string memory candidateName,
        string memory interviewDate,
        string memory feedback,
        uint8 rating
    ) external onlyOwner {
        require(rating <= 10, "Rating must be between 0-10");

        reports[nextTokenId] = InterviewReport(candidateName, interviewDate, feedback, rating);
        _safeMint(recipient, nextTokenId);
        nextTokenId++;
    }

    function getReport(uint256 tokenId) external view returns (InterviewReport memory) {
        require(_tokenExists(tokenId), "Credential does not exist");
        return reports[tokenId];
    }

    function _tokenExists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0); // Check if token has an owner
    }
}
