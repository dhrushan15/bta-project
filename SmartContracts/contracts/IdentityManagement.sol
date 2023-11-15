// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdentityManagement {
    // Struct to represent an identity
    struct Identity {
        uint256 id;
        address owner;
        string username;
        string publicKey;
        string email;
        string dateOfBirth;
        bool isVerified;
    }

    // Mapping from identity ID to Identity
    mapping(uint256 => Identity) public identities;

    // Mapping from address to identity ID
    mapping(address => uint256) public addressToIdentity;

    // Event triggered when a new identity is created or updated
    event IdentityUpdated(uint256 indexed id, address indexed owner, string username, string publicKey, string email, string dateOfBirth, bool isVerified);

    // Event triggered when a new identity is created
    event IdentityCreated(uint256 indexed id, address indexed owner, string username, string publicKey, string email, string dateOfBirth, bool isVerified);

    // Modifier to ensure that only the owner of an identity can perform certain operations
    modifier onlyIdentityOwner(uint256 _identityId) {
        require(msg.sender == identities[_identityId].owner, "Not the owner of the identity");
        _;
    }

// Function to create a new identity
function createIdentity(string memory _username, string memory _publicKey, string memory _email, string memory _dateOfBirth) external {
    require(addressToIdentity[msg.sender] == 0, "Identity already exists for this address");

    // Check for empty strings
    require(bytes(_username).length > 0, "Username cannot be empty");
    require(bytes(_publicKey).length > 0, "Public key cannot be empty");
    require(bytes(_email).length > 0, "Email cannot be empty");
    require(bytes(_dateOfBirth).length > 0, "Date of Birth cannot be empty");

    // Generate a unique ID using the transaction hash and sender's address
    uint256 newIdentityId = uint256(keccak256(abi.encodePacked(tx.origin, msg.sender, block.timestamp)));

    Identity memory newIdentity = Identity(newIdentityId, msg.sender, _username, _publicKey, _email, _dateOfBirth, false);

    identities[newIdentityId] = newIdentity;
    addressToIdentity[msg.sender] = newIdentityId;

    emit IdentityCreated(newIdentityId, msg.sender, _username, _publicKey, _email, _dateOfBirth, false);
}




    // Function to update profile information
    function updateProfile(uint256 _identityId, string memory _email, string memory _dateOfBirth) external onlyIdentityOwner(_identityId) {
    // Ensure the identity exists
    require(identities[_identityId].id != 0, "Identity does not exist");

    // Ensure inputs are not empty
    require(bytes(_email).length > 0, "Email cannot be empty");
    require(bytes(_dateOfBirth).length > 0, "Date of Birth cannot be empty");

    Identity storage identity = identities[_identityId];
    identity.email = _email;
    identity.dateOfBirth = _dateOfBirth;

    emit IdentityUpdated(_identityId, identity.owner, identity.username, identity.publicKey, _email, _dateOfBirth, identity.isVerified);
}
    // Function to verify identity
function verifyIdentity(uint256 _identityId) external onlyIdentityOwner(_identityId) {
    // Ensure the identity exists
    require(identities[_identityId].id != 0, "Identity does not exist");

    Identity storage identity = identities[_identityId];

    // Check if the identity is not already verified
    require(!identity.isVerified, "Identity is already verified");

    // Set the isVerified flag to true
    identity.isVerified = true;

    // Emit an event to signal the verification
    emit IdentityUpdated(_identityId, identity.owner, identity.username, identity.publicKey, identity.email, identity.dateOfBirth, true);
}

    // Function to get identity details
    function getIdentityDetails(uint256 _identityId) external view returns (Identity memory) {
    // Ensure the identity exists
    require(identities[_identityId].id != 0, "Identity does not exist");

    // Return the identity details
    return identities[_identityId];
}
}
