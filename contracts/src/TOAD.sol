// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/IGovernor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/**
 * @dev Custom errors for the TOAD contract
 * @notice These errors are used to provide more gas-efficient error handling
 */

/// @dev Thrown when a function is called by an address that is not the admin
error CallerNotAdmin();

/// @dev Thrown when a function is called by an address that is not TOAD
error CallerNotToad();

/// @dev Thrown when a function is called by an address that is not a member
error CallerNotMember();

/// @dev Thrown when a zero address is provided where a non-zero address is required
error ZeroAddressNotAllowed();

/// @dev Thrown when attempting to set a valid block interval of zero
error ValidBlockIntervalMustBeGreaterThanZero();

/// @dev Thrown when array lengths do not match in functions requiring matching arrays
error ArrayLengthsMustMatch();

/// @dev Thrown when attempting to answer proposals when no proposals exist
error NoProposalsToAnswer();

/// @dev Thrown when attempting to answer a proposal that is no longer active
error ProposalNotActiveForAnswering();

/// @dev Thrown when attempting to announce results that have already been announced
error ResultsAlreadyAnnounced();

/// @dev Thrown when attempting to clear proposals when no proposals exist
error NoProposalsToClear();

/// @dev Thrown when attempting to access a proposal index that is out of bounds
error ProposalIndexOutOfBounds();

/// @dev Thrown when attempting to clear a proposal that is still active
error ProposalStillActive();

/// @dev Thrown when attempting to set disable power with zero voting power
error CallerHasNoVotingPower();

/// @dev Thrown when attempting to disable a proposal that is no longer active
error ProposalNotActiveForDisabling();

/// @dev Thrown when attempting to set disable power for a proposal that is already being disabled by the caller
error CallerAlreadyDisablingProposal();

/// @dev Thrown when attempting to toggle a proposal for a member with no voting power
error MemberHasNoVotingPower();

/// @dev Thrown when attempting to perform an operation with an empty array
error EmptyArrayNotAllowed();

/// @dev Thrown when attempting to perform an operation that requires the Tally Governor to be set
error TallyGovernorNotSet();

/// @dev Thrown when attempting to add a duplicate proposal
error DuplicateProposal();

/**
 * @dev Represents the possible voting options for proposals
 */
enum Answer {
    AGAINST, // 0 in Governor
    FOR, // 1 in Governor
    ABSTAIN // 2 in Governor
}

/**
 * @dev Represents a disabler's state for a proposal
 * @param confirmed Whether the disabler has confirmed their disable power
 * @param votingPower The voting power of the disabler
 */
struct Disabler {
    bool confirmed;
    uint votingPower;
}

/**
 * @dev Represents a proposal in the TOAD system
 * @param tallyId Unique identifier for the proposal
 * @param answer TOAD's vote on the proposal
 * @param discoveredAt Block number when the proposal was discovered
 * @param validBlock Last block number when members can interact with TOAD
 * @param disablePower Total voting power of all disablers for this proposal
 * @param votingPeriod Block number when the proposal becomes inactive
 * @param announced Whether the results have been announced
 */
struct Proposal {
    uint tallyId;
    Answer answer;
    string reason;
    uint discoveredAt;
    uint validBlock;
    uint disablePower;
    uint votingPeriod;
    bool announced;
}

/**
 * @dev Represents a proposal in the TOAD system for external view
 * @notice This struct is used to return proposal data without exposing internal mappings
 */
struct ProposalView {
    uint tallyId;
    Answer answer;
    string reason;
    uint discoveredAt;
    uint validBlock;
    uint disablePower;
    uint votingPeriod;
    bool announced;
}

/**
 * @dev Emitted when proposal results are announced
 * @param tallyId The ID of the proposal
 * @param answer The final vote decision
 */
event ResultsAnnounced(uint256 indexed tallyId, Answer answer);

/**
 * @dev Emitted when a vote is cast
 * @param tallyId The ID of the proposal
 * @param answer The answer given to the proposal
 * @param reason The reason for the vote
 */
event VoteCast(uint256 indexed tallyId, Answer answer, string reason);

/**
 * @dev Emitted when admin address is changed
 * @param oldAdmin Previous admin address
 * @param newAdmin New admin address
 */
event AdminChanged(address oldAdmin, address newAdmin);

/**
 * @dev Emitted when TOAD address is changed
 * @param oldToad Previous TOAD address
 * @param newToad New TOAD address
 */
event ToadChanged(address oldToad, address newToad);

/**
 * @dev Emitted when valid block interval is changed
 * @param oldValidBlockInterval Previous interval value
 * @param newValidBlockInterval New interval value
 */
event ValidBlockIntervalChanged(
    uint oldValidBlockInterval,
    uint newValidBlockInterval
);

/**
 * @dev Emitted when Tally Governor address is changed
 * @param oldTallyGovernor Previous Tally Governor address
 * @param newTallyGovernor New Tally Governor address
 */
event TallyGovernorChanged(address oldTallyGovernor, address newTallyGovernor);

/**
 * @dev Emitted when a disabler is added to a proposal
 * @param tallyId The ID of the proposal
 * @param disabler The address of the disabler
 * @param votingPower The voting power of the disabler
 */
event DisablerAdded(uint tallyId, address disabler, uint votingPower);

/**
 * @dev Emitted when a proposal is cleared
 * @param tallyId The ID of the proposal that was cleared
 */
event ProposalCleared(uint tallyId);

/// @title TOAD
/// @dev A contract for managing TOAD (Trustless Onchain Autonomous Delegate) voting system
/// @notice This contract implements a voting system where TOAD can be disabled by members with sufficient voting power
/// @custom:security-contact [email to be added]
contract TOAD {
    /// @dev Array of all active proposals
    Proposal[] private proposals;

    /// @dev Number of blocks during which answers are considered valid
    uint public validBlockInterval;

    /// @dev Address of the TOAD system
    address public toad;

    /// @dev Whether TOAD is currently disabled
    bool public disabled;

    /// @dev Address of the admin
    address public admin;

    /// @dev Address of the Tally Governor contract
    GovernorVotes public tallyGovernor;

    /// @dev Mapping of proposal IDs to tally IDs
    mapping(uint => uint) public proposalList;

    /// @dev Mapping of proposal IDs to disabler addresses
    mapping(uint => mapping(address => Disabler)) public proposalDisablerList;

    /**
     * @dev Ensures the caller is the admin
     */
    modifier onlyAdmin() {
        if (msg.sender != admin) revert CallerNotAdmin();
        _;
    }

    /**
     * @dev Ensures the caller is TOAD
     */
    modifier onlyToad() {
        if (msg.sender != toad) revert CallerNotToad();
        _;
    }

    modifier onlyMembers() {
        if (!isMember(msg.sender)) revert CallerNotMember();
        _;
    }

    /**
     * @dev Initializes the contract with the TOAD address
     * @param _toad Address of the TOAD system
     */
    constructor(address _toad) {
        if (_toad == address(0)) revert ZeroAddressNotAllowed();
        admin = msg.sender;
        toad = _toad;
        validBlockInterval = 1 days;
    }

    // Admin functions

    /**
     * @dev Set the admin address
     * @param _admin The new admin address
     */
    function setAdmin(address _admin) external onlyAdmin {
        if (_admin == address(0)) revert ZeroAddressNotAllowed();
        emit AdminChanged(admin, _admin);
        admin = _admin;
    }

    /**
     * @dev Set the toad address
     * @param _toad The new toad address
     */
    function setToad(address _toad) external onlyAdmin {
        if (_toad == address(0)) revert ZeroAddressNotAllowed();
        emit ToadChanged(toad, _toad);
        toad = _toad;
    }

    /**
     * @dev Set the valid block interval
     * @param _validBlockInterval The new valid block interval
     */
    function setValidBlockInterval(
        uint _validBlockInterval
    ) external onlyAdmin {
        if (_validBlockInterval == 0)
            revert ValidBlockIntervalMustBeGreaterThanZero();
        emit ValidBlockIntervalChanged(validBlockInterval, _validBlockInterval);
        validBlockInterval = _validBlockInterval;
    }

    /**
     * @dev Set the Tally Governor address
     * @param _tallyGovernor The new Tally Governor address
     */
    function setTallyGovernor(address _tallyGovernor) external onlyAdmin {
        if (_tallyGovernor == address(0)) revert ZeroAddressNotAllowed();
        emit TallyGovernorChanged(address(tallyGovernor), _tallyGovernor);
        tallyGovernor = GovernorVotes(payable(_tallyGovernor));
    }

    // TOAD functions

    /**
     * @dev Discovers new proposals from the Tally Governor
     * @param _tallyIds Array of proposal IDs to discover
     * @param _votingPeriods Array of voting periods for each proposal
     * @notice Only TOAD can call this function
     * @notice Array lengths must match
     */
    function discoverProposals(
        uint[] memory _tallyIds,
        uint[] memory _votingPeriods
    ) external onlyToad {
        if (_tallyIds.length == 0) revert EmptyArrayNotAllowed();
        if (_tallyIds.length != _votingPeriods.length)
            revert ArrayLengthsMustMatch();

        // Check for duplicate proposals
        for (uint i = 0; i < _tallyIds.length; i++) {
            uint index = proposalList[_tallyIds[i]];
            if (
                index < proposals.length &&
                proposals[index].tallyId == _tallyIds[i]
            ) {
                revert DuplicateProposal();
            }
        }

        // Add new proposals
        for (uint i = 0; i < _tallyIds.length; i++) {
            uint index = proposals.length;
            proposalList[_tallyIds[i]] = index;
            proposals.push(
                Proposal({
                    tallyId: _tallyIds[i],
                    answer: Answer.ABSTAIN,
                    reason: "",
                    discoveredAt: block.number,
                    validBlock: block.number + validBlockInterval,
                    disablePower: 0,
                    votingPeriod: block.number + _votingPeriods[i],
                    announced: false
                })
            );
        }
    }

    /**
     * @dev Records TOAD's answers for multiple proposals
     * @param _tallyIds Array of proposal IDs to answer
     * @param _answers Array of answers corresponding to each proposal
     * @notice Proposals must be within their valid block period
     */
    function answer(
        uint[] memory _tallyIds,
        Answer[] memory _answers,
        string[] memory _reasons
    ) external onlyToad {
        if (proposals.length == 0) revert NoProposalsToAnswer();
        if (_tallyIds.length != _answers.length) revert ArrayLengthsMustMatch();
        if (_tallyIds.length != _reasons.length) revert ArrayLengthsMustMatch();
        for (uint i = 0; i < _tallyIds.length; i++) {
            uint index = proposalList[_tallyIds[i]];
            Proposal storage proposal = proposals[index];
            if (block.number >= proposal.validBlock)
                revert ProposalNotActiveForAnswering();

            proposal.answer = _answers[i];
            proposal.reason = _reasons[i];
        }
    }

    /**
     * @dev Announces the results of multiple proposals
     * @param _tallyIds Array of proposal IDs to announce
     * @notice Results can only be announced once per proposal
     */
    function announceResults(uint[] memory _tallyIds) external onlyToad {
        for (uint i = 0; i < _tallyIds.length; i++) {
            uint index = proposalList[_tallyIds[i]];
            Proposal storage proposal = proposals[index];
            if (proposal.announced) revert ResultsAlreadyAnnounced();
            emit ResultsAnnounced(proposal.tallyId, proposal.answer);
            proposal.announced = true;
        }
    }

    /**
     * @dev Removes an expired proposal from the system
     * @param _index Index of the proposal to clear
     * @notice Proposal must be past its voting period to be cleared
     */
    function _clearProposal(uint _index) public onlyToad {
        if (proposals.length == 0) revert NoProposalsToClear();
        if (_index >= proposals.length) revert ProposalIndexOutOfBounds();
        Proposal storage proposal = proposals[_index];
        if (block.number <= proposal.votingPeriod) revert ProposalStillActive();
        uint tallyId = proposal.tallyId;
        delete proposals[_index];
        delete proposalList[tallyId];
        emit ProposalCleared(tallyId);
    }

    /**
     * @dev Clears a proposal by its tally ID
     * @param _tallyId The ID of the proposal to clear
     * @notice Proposal must be past its voting period to be cleared
     */
    function clearProposalByTallyId(uint _tallyId) public virtual onlyToad {
        uint index = proposalList[_tallyId];
        if (index >= proposals.length) revert ProposalIndexOutOfBounds();
        _clearProposal(index);
    }

    /**
     * @dev Clears a proposal by its index
     * @param _index The index of the proposal to clear
     * @notice Proposal must be past its voting period to be cleared
     */
    function clearProposalByIndex(uint _index) public virtual onlyToad {
        if (_index >= proposals.length) revert ProposalIndexOutOfBounds();
        _clearProposal(_index);
    }

    // Member functions
    /**
     * @dev Checks if a user has voting power through delegation
     * @param _address The address to check
     * @return bool Whether the address has voting power
     */
    function hasVotingPower(address _address) public view returns (bool) {
        if (address(tallyGovernor) == address(0)) revert TallyGovernorNotSet();
        if (_address == address(0)) revert ZeroAddressNotAllowed();
        ERC20Votes token = ERC20Votes(address(tallyGovernor.token()));
        return token.getVotes(_address) > 0;
    }

    /**
     * @dev Checks if an address has delegated to TOAD
     * @param _address The address to check
     * @return bool Whether the address has delegated to TOAD
     */
    function isMember(address _address) public view returns (bool) {
        if (address(tallyGovernor) == address(0)) revert TallyGovernorNotSet();
        if (_address == address(0)) revert ZeroAddressNotAllowed();
        return
            ERC20Votes(address(tallyGovernor.token())).delegates(_address) ==
            address(this);
    }

    /**
     * @dev Sets the voting power for specified proposals. This will not disable TOAD's voting ability until toggle is called.
     * @param _tallyIds Array of proposal IDs to set disable power for
     */
    function setDisablePower(uint[] memory _tallyIds) external {
        if (msg.sender == address(0)) revert ZeroAddressNotAllowed();
        if (!hasVotingPower(msg.sender)) revert CallerHasNoVotingPower();

        uint votingPower = ERC20Votes(address(tallyGovernor.token())).getVotes(
            msg.sender
        );

        for (uint i = 0; i < _tallyIds.length; i++) {
            uint index = proposalList[_tallyIds[i]];
            if (index >= proposals.length) revert ProposalIndexOutOfBounds();
            Proposal memory proposal = proposals[index];
            if (block.number >= proposal.validBlock)
                revert ProposalNotActiveForDisabling();
            if (proposalDisablerList[_tallyIds[i]][msg.sender].votingPower > 0)
                revert CallerAlreadyDisablingProposal();
            proposalDisablerList[_tallyIds[i]][msg.sender] = Disabler({
                confirmed: false,
                votingPower: votingPower
            });
            emit DisablerAdded(_tallyIds[i], msg.sender, votingPower);
        }
    }

    /**
     * @dev Toggles the disable power for specified proposals. If the member has not confirmed the disable power, it will be added to the proposal. If the user is not a member, it will be removed from the proposal and the disable power will be subtracted from the proposal. If the user is the member, it will be removed from the proposal and the disable power will be subtracted from the proposal.
     * @param _tallyIds Array of proposal IDs to toggle disable power for
     * @param _member The address of the member to toggle disable power for
     */
    function toggle(uint[] memory _tallyIds, address _member) external {
        if (_member == address(0)) revert ZeroAddressNotAllowed();
        for (uint i = 0; i < _tallyIds.length; i++) {
            if (proposalDisablerList[_tallyIds[i]][_member].votingPower == 0)
                revert MemberHasNoVotingPower();
            uint index = proposalList[_tallyIds[i]];
            if (index >= proposals.length) revert ProposalIndexOutOfBounds();
            Proposal storage proposal = proposals[index];

            if (
                proposalDisablerList[_tallyIds[i]][_member].confirmed ==
                false &&
                isMember(_member)
            ) {
                proposal.disablePower += proposalDisablerList[_tallyIds[i]][
                    _member
                ].votingPower;
                proposalDisablerList[_tallyIds[i]][_member].confirmed = true;
            } else if (
                proposalDisablerList[_tallyIds[i]][_member].confirmed == true &&
                !isMember(_member)
            ) {
                proposal.disablePower -= proposalDisablerList[_tallyIds[i]][
                    _member
                ].votingPower;
                proposalDisablerList[_tallyIds[i]][_member].confirmed = false;
            } else if (
                proposalDisablerList[_tallyIds[i]][_member].confirmed == true &&
                msg.sender == _member
            ) {
                proposal.disablePower -= proposalDisablerList[_tallyIds[i]][
                    _member
                ].votingPower;
                proposalDisablerList[_tallyIds[i]][_member].confirmed = false;
            }
        }
    }

    /**
     * @dev Checks if TOAD can vote on specified proposals
     * @param _tallyIds Array of proposal IDs to check
     * @return results Array of boolean values indicating if TOAD can vote on each proposal
     * @notice This is a gas-intensive operation and should be used off-chain
     */
    function canVote(
        uint[] memory _tallyIds
    ) public view returns (bool[] memory results) {
        if (_tallyIds.length == 0) revert EmptyArrayNotAllowed();
        results = new bool[](_tallyIds.length);
        for (uint i = 0; i < _tallyIds.length; i++) {
            uint index = proposalList[_tallyIds[i]];
            if (index >= proposals.length) revert ProposalIndexOutOfBounds();

            // We must be past the valid block
            if (block.number <= proposals[index].validBlock) {
                results[i] = false;
                continue;
            }
            // Get TOAD's current voting power
            uint enablePower = ERC20Votes(address(tallyGovernor.token()))
                .getVotes(toad);
            // Get the disable power for the proposal
            uint disablePower = proposals[index].disablePower;

            results[i] = disablePower > enablePower / 2 ? false : true;
        }
        return results;
    }

    /**
     * @dev Retrieves a proposal by its ID
     * @param _tallyId The ID of the proposal to retrieve
     * @return The proposal data without the disablers mapping
     */
    function getProposal(
        uint _tallyId
    ) public view returns (ProposalView memory) {
        uint index = proposalList[_tallyId];
        Proposal storage proposal = proposals[index];
        return
            ProposalView({
                tallyId: proposal.tallyId,
                answer: proposal.answer,
                reason: proposal.reason,
                discoveredAt: proposal.discoveredAt,
                validBlock: proposal.validBlock,
                disablePower: proposal.disablePower,
                votingPeriod: proposal.votingPeriod,
                announced: proposal.announced
            });
    }

    /**
     * @dev Casts votes on proposals using stored answers
     * @param _tallyIds Array of proposal IDs to vote on
     * @notice Only TOAD can call this function
     * @notice TOAD must be able to vote on the proposals (checked via canVote)
     */
    function vote(uint[] memory _tallyIds) external onlyToad {
        if (_tallyIds.length == 0) revert EmptyArrayNotAllowed();

        // Check if TOAD can vote on all proposals
        bool[] memory canVoteResults = canVote(_tallyIds);
        for (uint i = 0; i < _tallyIds.length; i++) {
            if (!canVoteResults[i]) {
                revert ProposalNotActiveForAnswering();
            }
        }

        // Get answers and reasons for each proposal
        Answer[] memory answers = new Answer[](_tallyIds.length);
        string[] memory reasons = new string[](_tallyIds.length);
        for (uint i = 0; i < _tallyIds.length; i++) {
            uint index = proposalList[_tallyIds[i]];
            Proposal storage proposal = proposals[index];
            answers[i] = proposal.answer;
            reasons[i] = proposal.reason;
        }

        // Cast votes using the Tally Governor
        for (uint i = 0; i < _tallyIds.length; i++) {
            // Map our Answer enum to Governor voting values
            uint8 governorVote;
            if (answers[i] == Answer.FOR) {
                governorVote = 1; // FOR in Governor
            } else if (answers[i] == Answer.AGAINST) {
                governorVote = 0; // AGAINST in Governor
            } else {
                governorVote = 2; // ABSTAIN in Governor
            }

            tallyGovernor.castVoteWithReason(
                _tallyIds[i],
                governorVote,
                reasons[i]
            );

            emit VoteCast(_tallyIds[i], answers[i], reasons[i]);
        }
    }
}
