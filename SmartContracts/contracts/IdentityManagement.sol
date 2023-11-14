// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdentityManagement {
    // Struct to represent an identity
    struct Identity {
        uint256 id;
        address owner;
        string username;
        string publicKey;
        bool isVerified;
    }

    // Mapping from identity ID to Identity
    mapping(uint256 => Identity) public identities;

    // Mapping from address to identity ID
    mapping(address => uint256) public addressToIdentity;

    // Event triggered when a new identity is created
    event IdentityCreated(uint256 indexed id, address indexed owner, string username, string publicKey);

    // Modifier to ensure that only the owner of an identity can perform certain operations
    modifier onlyIdentityOwner(uint256 _identityId) {
        require(msg.sender == identities[_identityId].owner, "Not the owner of the identity");
        _;
    }

    // Function to create a new identity
    function createIdentity(string memory _username, string memory _publicKey) external {
        require(addressToIdentity[msg.sender] == 0, "Identity already exists for this address");

        uint256 newIdentityId = uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp)));
        Identity memory newIdentity = Identity(newIdentityId, msg.sender, _username, _publicKey, false);

        identities[newIdentityId] = newIdentity;
        addressToIdentity[msg.sender] = newIdentityId;

        emit IdentityCreated(newIdentityId, msg.sender, _username, _publicKey);
    }

    // Function to verify an identity
    function verifyIdentity(uint256 _identityId) external onlyIdentityOwner(_identityId) {
        identities[_identityId].isVerified = true;
    }

    // Function to get identity details
    function getIdentityDetails(uint256 _identityId) external view returns (Identity memory) {
        return identities[_identityId];
    }
}
