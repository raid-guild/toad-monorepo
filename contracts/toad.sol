// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/IGovernor.sol";
import "forge-std/console2.sol";
import "@openzeppelin/contracts/governance/IVotes.sol";

/**
 * @title TOAD
 * @dev A contract for managing TOAD (Trustless Onchain Autonomous Delegate) voting system
 * @custom:security-contact [email to be added]
 */

/**
 * @dev Represents the possible voting options for proposals
 */
enum Answer {
    FOR,
    AGAINST,
    ABSTAIN
}

/**
 * @dev Represents a proposal in the TOAD system
 * @param tallyId Unique identifier for the proposal
 * @param answer TOAD's vote on the proposal
 * @param discoveredAt Timestamp when the proposal was discovered
 * @param validBlock Last block number when members can interact with TOAD
 * @param disablers List of addresses that voted to disable TOAD
 * @param votingPeriod Timestamp when the proposal becomes inactive
 * @param announced Whether the results have been announced
 */
struct Proposal {
    uint tallyId;
    Answer answer;
    uint discoveredAt;
    uint validBlock;
    address[] disablers;
    uint votingPeriod;
    bool announced;
}

/**
 * @dev Emitted when proposal results are announced
 * @param tallyId The ID of the proposal
 * @param answer The final vote decision
 */
event ResultsAnnounced(uint tallyId, Answer answer);

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
    Governor public tallyGovernor;

    /// @dev Mapping of proposal IDs to tally IDs
    mapping(uint => uint) public proposalList;

    /**
     * @dev Ensures the caller is the admin
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    /**
     * @dev Ensures the caller is TOAD
     */
    modifier onlyToad() {
        require(msg.sender == toad, "Only toad can call this function");
        _;
    }

    /**
     * @dev Initializes the contract with the TOAD address
     * @param _toad Address of the TOAD system
     */
    constructor(address _toad) {
        require(_toad != address(0), "Zero address not allowed");
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
        require(_admin != address(0), "Zero address not allowed");
        emit AdminChanged(admin, _admin);
        admin = _admin;
    }

    /**
     * @dev Set the toad address
     * @param _toad The new toad address
     */
    function setToad(address _toad) external onlyAdmin {
        require(_toad != address(0), "Zero address not allowed");
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
        require(
            _validBlockInterval > 0,
            "Valid block interval must be greater than 0"
        );
        emit ValidBlockIntervalChanged(validBlockInterval, _validBlockInterval);
        validBlockInterval = _validBlockInterval;
    }

    /**
     * @dev Set the Tally Governor address
     * @param _tallyGovernor The new Tally Governor address
     */
    function setTallyGovernor(address _tallyGovernor) external onlyAdmin {
        require(_tallyGovernor != address(0), "Zero address not allowed");
        emit TallyGovernorChanged(address(tallyGovernor), _tallyGovernor);
        tallyGovernor = Governor(payable(_tallyGovernor));
    }

    // TOAD functions

    /**
     * @dev Discovers and registers new proposals in the system
     * @param _tallyIds Array of proposal IDs to register
     * @param _votingPeriods Array of voting period durations for each proposal
     * @notice Clears inactive proposals before registering new ones
     */
    function discoverProposals(
        uint[] memory _tallyIds,
        uint[] memory _votingPeriods
    ) external onlyToad {
        require(
            _tallyIds.length == _votingPeriods.length,
            "tallyIds and votingPeriods must have the same length"
        );
        // clear all inactive proposals
        if (proposals.length > 0) {
            for (uint i = 0; i < proposals.length; i++) {
                if (block.number > proposals[i].votingPeriod) {
                    clearProposalByIndex(i);
                }
            }
        }

        // create new proposals
        for (uint i = 0; i < _tallyIds.length; i++) {
            Proposal memory proposal;
            proposal.tallyId = _tallyIds[i];
            proposal.answer = Answer.ABSTAIN;
            proposal.discoveredAt = block.number;
            proposal.validBlock = block.number + validBlockInterval;
            proposal.votingPeriod = block.number + _votingPeriods[i];
            proposal.announced = false;
            proposals.push(proposal);
            proposalList[_tallyIds[i]] = proposals.length - 1;
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
        Answer[] memory _answers
    ) external onlyToad {
        require(proposals.length > 0, "No proposals to answer");
        require(
            _tallyIds.length == _answers.length,
            "tallyIds and answers must have the same length"
        );
        for (uint i = 0; i < _tallyIds.length; i++) {
            uint index = proposalList[_tallyIds[i]];
            Proposal storage proposal = proposals[index];
            require(
                block.number < proposal.validBlock,
                "this proposal is not up for answering"
            );
            proposal.answer = _answers[i];
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
            require(
                proposal.announced == false,
                "results have already been announced"
            );
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
        require(proposals.length > 0, "No proposals to clear");
        require(_index < proposals.length, "Proposal index out of bounds");
        Proposal storage proposal = proposals[_index];
        require(
            (block.number > proposal.votingPeriod),
            "this proposal is still active"
        );
        delete proposals[_index];
        delete proposalList[proposal.tallyId];
    }

    /**
     * @dev Clears a proposal by its tally ID
     * @param _tallyId The ID of the proposal to clear
     * @notice Proposal must be past its voting period to be cleared
     */
    function clearProposalByTallyId(uint _tallyId) public virtual onlyToad {
        uint index = proposalList[_tallyId];
        require(index < proposals.length, "Proposal index out of bounds");
        _clearProposal(index);
    }

    /**
     * @dev Clears a proposal by its index
     * @param _index The index of the proposal to clear
     * @notice Proposal must be past its voting period to be cleared
     */
    function clearProposalByIndex(uint _index) public virtual onlyToad {
        require(_index < proposals.length, "Proposal index out of bounds");
        _clearProposal(_index);
    }

    // Member functions
    /**
     * @dev Disables TOAD's voting ability for specified proposals
     * @param _tallyIds Array of proposal IDs to disable
     */
    function disable(uint[] memory _tallyIds) external {
        for (uint i = 0; i < _tallyIds.length; i++) {
            uint index = proposalList[_tallyIds[i]];
            Proposal storage proposal = proposals[index];
            require(
                block.number < proposal.validBlock,
                "this proposal is not up to be disabled"
            );
            proposal.disablers.push(msg.sender);
        }
    }

    // view functions
    /**
     * @dev Checks if TOAD can vote on specified proposals
     * @param _tallyIds Array of proposal IDs to check
     * @return results Array of boolean values indicating if TOAD can vote on each proposal
     * @notice This is a gas-intensive operation and should be used off-chain
     */
    function canVote(
        uint[] memory _tallyIds
    ) public view returns (bool[] memory results) {
        results = new bool[](_tallyIds.length);
        for (uint i = 0; i < _tallyIds.length; i++) {
            uint index = proposalList[_tallyIds[i]];
            require(index < proposals.length, "Proposal index out of bounds");

            // Get TOAD's voting power at the valid block
            uint enablePower = IVotes(address(tallyGovernor.token()))
                .getPastVotes(toad, proposals[index].validBlock);

            // Calculate total voting power of disablers at the valid block
            uint disablePower = 0;
            for (uint j = 0; j < proposals[index].disablers.length; j++) {
                address disabler = proposals[index].disablers[j];
                // Only count voting power if the disabler is a member at the valid block
                if (isMember(disabler, _tallyIds[i])) {
                    disablePower += IVotes(address(tallyGovernor.token()))
                        .getPastVotes(disabler, proposals[index].validBlock);
                }
            }

            // TOAD can vote if its voting power is greater than the total voting power of disablers
            results[i] = enablePower > disablePower;
        }
        return results;
    }

    /**
     * @dev Retrieves a proposal by its ID
     * @param _tallyId The ID of the proposal to retrieve
     * @return The proposal data
     */
    function getProposal(uint _tallyId) public view returns (Proposal memory) {
        return proposals[proposalList[_tallyId]];
    }

    /**
     * @dev Check if an address is a member at a specific proposal
     * @param account The address to check
     * @param proposalId The ID of the proposal to check
     * @return bool Whether the address is a member
     */
    function isMember(
        address account,
        uint proposalId
    ) public view returns (bool) {
        require(address(tallyGovernor) != address(0), "Tally Governor not set");
        console2.log(
            "Checking membership for account %s for proposal %d",
            account,
            proposalId
        );
        bool hasVoted = tallyGovernor.hasVoted(proposalId, account);
        console2.log("Account has voted: %s", hasVoted);
        return hasVoted;
    }

    /**
     * @dev Check if an address is a member at the current block
     * @param account The address to check
     * @return bool Whether the address is a member
     */
    function isMemberNow(address account) public view returns (bool) {
        console2.log("Checking current membership for account %s", account);
        // Get the latest proposal ID from the proposals array
        require(proposals.length > 0, "No proposals exist");
        uint latestProposalId = proposals[proposals.length - 1].tallyId;
        bool result = isMember(account, latestProposalId);
        console2.log("Current membership status: %s", result);
        return result;
    }
}
