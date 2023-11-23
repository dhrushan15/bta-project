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

    Identity[] public allIdentities;
    // Mapping from identity ID to Identity
    mapping(uint256 => Identity) public identities;

    // Mapping from address to identity ID
    mapping(address => uint256) public addressToIdentity;

    // Event triggered when a new identity is created or updated
    event IdentityUpdated(uint256 indexed id, address indexed owner, string username, string publicKey, string email, string dateOfBirth, bool isVerified);

    // Event triggered when a new identity is created
    event IdentityCreated(uint256 indexed id, address indexed owner, string username, string publicKey, string email, string dateOfBirth, bool isVerified);

    //Event triggered when Credentials are Verified
    event CredentialsVerified(uint256 indexed id, address indexed owner, string email, string dateOfBirth, string username);

    

    // Modifier to ensure that only the owner of an identity can perform certain operations
    modifier onlyIdentityOwner(uint256 _identityId) {
        require(msg.sender == identities[_identityId].owner, "Not the owner of the identity");
        _;
    }

    // Function to create a new identity
    function createIdentity(string memory _username, string memory _publicKey, string memory _email, string memory _dateOfBirth) external {

        // Check for empty strings
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_publicKey).length > 0, "Public key cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(bytes(_dateOfBirth).length > 0, "Date of Birth cannot be empty");

        // Generate a unique ID using the transaction hash and sender's address
        uint256 newIdentityId = uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp)));
        newIdentityId = newIdentityId % 1e12;

        Identity memory newIdentity = Identity(newIdentityId, msg.sender, _username, _publicKey, _email, _dateOfBirth, false);

        identities[newIdentityId] = newIdentity;
        addressToIdentity[msg.sender] = newIdentityId;

        allIdentities.push(newIdentity);

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
        identity.isVerified = false;

        // Update allIdentities array
        for (uint256 i = 0; i < allIdentities.length; i++) {
            if (allIdentities[i].id == _identityId) {
                allIdentities[i].email = _email;
                allIdentities[i].dateOfBirth = _dateOfBirth;
                allIdentities[i].isVerified = false;
                break;
            }
        }

        emit IdentityUpdated(_identityId, identity.owner, identity.username, identity.publicKey, _email, _dateOfBirth, identity.isVerified);
    }

    // Function to verify identity
    function verifyIdentity(uint256 _identityId) external  {
        // Ensure the identity exists
        require(identities[_identityId].id != 0, "Identity does not exist");

        Identity storage identity = identities[_identityId];

        // Check if the identity is not already verified
        require(!identity.isVerified, "Identity is already verified");

        // Set the isVerified flag to true
        identity.isVerified = true;

        // Update allIdentities array
        for (uint256 i = 0; i < allIdentities.length; i++) {
            if (allIdentities[i].id == _identityId) {
                allIdentities[i].isVerified = true;
                break;
            }
        }

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

   // Function to verify credentials
function verifyCredentials(uint256 _identityId, string memory _email, string memory _dateOfBirth, string memory _username) external payable  {
    // Ensure the identity exists
    require(identities[_identityId].id != 0, "Identity does not exist");

    Identity storage identity = identities[_identityId];

    // Check if the identity is verified
    require(identity.isVerified, "Identity is not verified");

    // Check if the provided details match with the stored details
    require(keccak256(bytes(identity.email)) == keccak256(bytes(_email)), "Wrong email");
    require(keccak256(bytes(identity.dateOfBirth)) == keccak256(bytes(_dateOfBirth)), "Wrong date of birth");
    require(keccak256(bytes(identity.username)) == keccak256(bytes(_username)), "Wrong username");

    // Perform additional actions or state changes as needed for the transaction

    // Emit an event or perform any other necessary actions
    emit CredentialsVerified(_identityId, identity.owner, _email, _dateOfBirth, _username);
}

// Function to get all identities
    function getAllIdentities() external view returns (Identity[] memory) {
        return allIdentities;
    }

    // Function to get all identities by wallet address
    function getIdentitiesByAddress(address _walletAddress) external view returns (Identity[] memory) {
        uint256 identityId = addressToIdentity[_walletAddress];

        // Ensure the provided wallet address is associated with at least one identity
        require(identityId != 0, "No identity found for the provided wallet address");

        uint256 count = 0;
        // Count the number of identities associated with the provided wallet address
        for (uint256 i = 0; i < allIdentities.length; i++) {
            if (allIdentities[i].owner == _walletAddress) {
                count++;
            }
        }

        Identity[] memory userIdentities = new Identity[](count);
        uint256 index = 0;

        // Populate the array with identities associated with the provided wallet address
        for (uint256 i = 0; i < allIdentities.length; i++) {
            if (allIdentities[i].owner == _walletAddress) {
                userIdentities[index++] = allIdentities[i];
            }
        }

        return userIdentities;
    }
    
}


