// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/console2.sol";
import {TOAD, ResultsAnnounced, AdminChanged, ToadChanged, ValidBlockIntervalChanged, TallyGovernorChanged, Proposal, Answer} from "../toad.sol";
import "./mocks/MockGovernor.sol";
import "./mocks/MockToken.sol";

contract TOADTest is Test {
    TOAD public toad;
    address public admin;
    address public toadAddress;
    address public user1;
    address public user2;

    MockGovernor public mockGovernor;
    MockToken public mockToken;
    uint256 public proposalId;
    uint256 public proposalId2;

    function setUp() public {
        admin = address(this);
        toadAddress = makeAddr("toad");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        toad = new TOAD(toadAddress);
        mockToken = new MockToken();
        mockGovernor = new MockGovernor(IVotes(address(mockToken)));

        // Create first fake proposal data
        address[] memory targets1 = new address[](1);
        targets1[0] = address(0);
        uint256[] memory values1 = new uint256[](1);
        values1[0] = 0;
        bytes[] memory calldatas1 = new bytes[](1);
        calldatas1[0] = "";
        string memory description1 = "Test Proposal 1";

        // Create second fake proposal data
        address[] memory targets2 = new address[](1);
        targets2[0] = address(0);
        uint256[] memory values2 = new uint256[](1);
        values2[0] = 0;
        bytes[] memory calldatas2 = new bytes[](1);
        calldatas2[0] = "";
        string memory description2 = "Test Proposal 2";

        proposalId = mockGovernor.propose(
            targets1,
            values1,
            calldatas1,
            description1
        );
        proposalId2 = mockGovernor.propose(
            targets2,
            values2,
            calldatas2,
            description2
        );

        // Mint some tokens to users for testing
        mockToken.mint(user1, 1000);
        mockToken.mint(user2, 1000);
    }

    function testInitialState() public {
        assertEq(toad.admin(), admin);
        assertEq(toad.toad(), toadAddress);
        assertEq(toad.validBlockInterval(), 1 days);
        assertEq(toad.disabled(), false);
    }

    function testSetAdmin() public {
        address newAdmin = makeAddr("newAdmin");
        vm.expectEmit(true, true, true, true);
        emit AdminChanged(admin, newAdmin);
        toad.setAdmin(newAdmin);
        assertEq(toad.admin(), newAdmin);
    }

    function testSetToad() public {
        address newToad = makeAddr("newToad");
        vm.expectEmit(true, true, true, true);
        emit ToadChanged(toadAddress, newToad);
        toad.setToad(newToad);
        assertEq(toad.toad(), newToad);
    }

    function testSetValidBlockInterval() public {
        uint newInterval = 100;
        vm.expectEmit(true, true, true, true);
        emit ValidBlockIntervalChanged(1 days, newInterval);
        toad.setValidBlockInterval(newInterval);
        assertEq(toad.validBlockInterval(), newInterval);
    }

    function test_RevertWhen_NonAdminSetsAdmin() public {
        vm.prank(user1);
        vm.expectRevert("Only admin can call this function");
        toad.setAdmin(user2);
    }

    function test_RevertWhen_NonAdminSetsToad() public {
        vm.prank(user1);
        vm.expectRevert("Only admin can call this function");
        toad.setToad(user2);
    }

    function test_RevertWhen_NonAdminSetsValidBlockInterval() public {
        vm.prank(user1);
        vm.expectRevert("Only admin can call this function");
        toad.setValidBlockInterval(100);
    }

    function testDiscoverProposals() public {
        // First discover some initial proposals
        uint[] memory initialTallyIds = new uint[](1);
        initialTallyIds[0] = 1;
        uint[] memory initialVotingPeriods = new uint[](1);
        initialVotingPeriods[0] = 1 days;

        vm.prank(toadAddress);
        toad.discoverProposals(initialTallyIds, initialVotingPeriods);

        // Advance block number past the voting period
        vm.roll(block.number + 2 days);

        // Create new proposals
        address[] memory targets = new address[](2);
        targets[0] = address(0);
        targets[1] = address(0);
        uint256[] memory values = new uint256[](2);
        values[0] = 0;
        values[1] = 0;
        bytes[] memory calldatas = new bytes[](2);
        calldatas[0] = "";
        calldatas[1] = "";
        string[] memory descriptions = new string[](2);
        descriptions[0] = "Test Proposal 1";
        descriptions[1] = "Test Proposal 2";

        uint256 newProposalId1 = mockGovernor.propose(
            targets,
            values,
            calldatas,
            descriptions[0]
        );
        uint256 newProposalId2 = mockGovernor.propose(
            targets,
            values,
            calldatas,
            descriptions[1]
        );

        // Now test discovering new proposals
        uint[] memory tallyIds = new uint[](2);
        tallyIds[0] = newProposalId1;
        tallyIds[1] = newProposalId2;
        uint[] memory votingPeriods = new uint[](2);
        votingPeriods[0] = 1 days;
        votingPeriods[1] = 2 days;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        // Verify the new proposals
        Proposal memory proposal1 = toad.getProposal(newProposalId1);
        Proposal memory proposal2 = toad.getProposal(newProposalId2);

        assertEq(proposal1.tallyId, newProposalId1);
        assertEq(uint(proposal1.answer), uint(Answer.ABSTAIN));
        assertEq(proposal1.votingPeriod, block.number + 1 days);
        assertEq(proposal1.announced, false);

        assertEq(proposal2.tallyId, newProposalId2);
        assertEq(uint(proposal2.answer), uint(Answer.ABSTAIN));
        assertEq(proposal2.votingPeriod, block.number + 2 days);
        assertEq(proposal2.announced, false);
    }

    function testAnswer() public {
        console2.log("Setting up test...");
        // Set up Tally Governor
        toad.setTallyGovernor(address(mockGovernor));

        console2.log("Minting and delegating tokens...");
        // Mint tokens to admin (proposer) and users
        mockToken.mint(address(this), 1000);
        mockToken.mint(user1, 1000);

        // Delegate voting power before creating proposals
        mockToken.delegate(address(this));
        vm.startPrank(user1);
        mockToken.delegate(user1);
        vm.stopPrank();

        // Move forward one block to ensure voting power is set
        vm.roll(block.number + 1);
        console2.log("Current block after delegation: %d", block.number);

        // Create proposal data
        address[] memory targets = new address[](1);
        targets[0] = address(0);
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = "";
        string memory description = "Test Proposal";

        // Create proposal
        console2.log("Creating proposal...");
        proposalId = mockGovernor.propose(
            targets,
            values,
            calldatas,
            description
        );
        console2.log("Proposal created with ID: %d", proposalId);
        console2.log("Current block: %d", block.number);
        uint256 snapshot = mockGovernor.proposalSnapshot(proposalId);
        uint256 deadline = mockGovernor.proposalDeadline(proposalId);
        console2.log("Proposal snapshot: %d, deadline: %d", snapshot, deadline);

        // Wait for proposal to be active
        vm.roll(snapshot + 1);
        console2.log("Current block after delay: %d", block.number);
        console2.log(
            "Proposal state: %d",
            uint(mockGovernor.state(proposalId))
        );

        // Discover proposal in TOAD
        console2.log("Discovering proposal in TOAD...");
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = proposalId;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 100; // 100 blocks

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);
        console2.log("Proposal discovered in TOAD");

        // Set valid block interval
        toad.setValidBlockInterval(100);
        console2.log("Set valid block interval to: %d", uint(100));

        // Vote on proposal
        vm.prank(user1);
        mockGovernor.castVote(proposalId, 1); // 1 = For
        console2.log("User1 voted FOR on proposal");

        // Wait for voting period to end
        vm.roll(deadline + 1);
        console2.log("Current block after voting period: %d", block.number);

        // Answer proposal
        console2.log("Answering proposal...");
        Answer[] memory answers = new Answer[](1);
        answers[0] = Answer.FOR;

        vm.prank(toadAddress);
        toad.answer(tallyIds, answers);
        console2.log("Proposal answered");

        // Verify answer
        Proposal memory proposal = toad.getProposal(proposalId);
        assertEq(uint(proposal.answer), uint(Answer.FOR));
    }

    function testAnnounceResults() public {
        // First discover and answer a proposal
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 1 days;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        toad.setValidBlockInterval(100);

        Answer[] memory answers = new Answer[](1);
        answers[0] = Answer.FOR;

        vm.prank(toadAddress);
        toad.answer(tallyIds, answers);

        // Announce results using array index 0
        uint[] memory indexes = new uint[](1);
        indexes[0] = 0;

        vm.expectEmit(true, true, true, true);
        emit ResultsAnnounced(1, Answer.FOR);

        vm.prank(toadAddress);
        toad.announceResults(indexes);

        Proposal memory proposal = toad.getProposal(1);
        assertEq(proposal.announced, true);
    }

    function testDisable() public {
        // First discover a proposal
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 1 days;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        // Set valid block interval
        toad.setValidBlockInterval(100);

        // Disable TOAD
        vm.prank(user1);
        toad.disable(tallyIds);

        Proposal memory proposal = toad.getProposal(1);
        assertEq(proposal.disablers.length, 1);
        assertEq(proposal.disablers[0], user1);
    }

    function testClearProposal() public {
        // First discover a proposal
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 1 days;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        // Fast forward past voting period
        vm.roll(block.number + 2 days);

        // Clear proposal
        vm.prank(toadAddress);
        toad.clearProposalByTallyId(tallyIds[0]);

        // Verify proposal is cleared
        Proposal memory proposal = toad.getProposal(0);
        assertEq(proposal.tallyId, 0);
        assertEq(proposal.discoveredAt, 0);
        assertEq(proposal.validBlock, 0);
        assertEq(proposal.votingPeriod, 0);
        assertEq(proposal.announced, false);
        assertEq(proposal.disablers.length, 0);
    }

    function testCanVote() public {
        // First discover a proposal
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 1 days;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        // Set valid block interval
        toad.setValidBlockInterval(100);

        // Check if can vote
        bool[] memory results = toad.canVote(tallyIds);
        assertEq(results.length, 1);
        assertEq(results[0], true); // Currently always returns true as enablePower is hardcoded to 0
    }

    function testSetTallyGovernor() public {
        address newTallyGovernor = address(mockGovernor);
        vm.expectEmit(true, true, true, true);
        emit TallyGovernorChanged(address(0), newTallyGovernor);
        toad.setTallyGovernor(newTallyGovernor);
        assertEq(address(toad.tallyGovernor()), newTallyGovernor);
    }

    function test_RevertWhen_NonAdminSetsTallyGovernor() public {
        vm.prank(user1);
        vm.expectRevert("Only admin can call this function");
        toad.setTallyGovernor(address(mockGovernor));
    }

    function test_RevertWhen_ZeroAddressSetsTallyGovernor() public {
        vm.expectRevert("Zero address not allowed");
        toad.setTallyGovernor(address(0));
    }

    function testIsMember() public {
        console2.log("Starting testIsMember...");

        // Set up Tally Governor
        console2.log("Setting up Tally Governor...");
        toad.setTallyGovernor(address(mockGovernor));

        // Mint and delegate tokens
        console2.log("Minting and delegating tokens to user1...");
        mockToken.mint(user1, 1000);
        vm.prank(user1);
        mockToken.delegate(user1);
        console2.log("User1 voting power: %d", mockToken.getVotes(user1));

        // Create a proposal and vote
        console2.log("Creating proposal...");
        address[] memory targets = new address[](1);
        targets[0] = address(0);
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = "";
        uint256 newProposalId = mockGovernor.propose(
            targets,
            values,
            calldatas,
            "Proposal"
        );
        console2.log("Proposal created with ID: %d", newProposalId);

        // Wait for proposal to be active
        uint256 snapshot = mockGovernor.proposalSnapshot(newProposalId);
        console2.log("Proposal snapshot block: %d", snapshot);
        vm.roll(snapshot + 1);
        console2.log("Current block after delay: %d", block.number);

        // Vote on the proposal
        console2.log("User1 voting on proposal...");
        vm.prank(user1);
        mockGovernor.castVote(newProposalId, 1); // 1 = For
        console2.log("Vote cast successfully");

        // Discover proposal in TOAD
        console2.log("Discovering proposal in TOAD...");
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = newProposalId;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 100;
        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        // Test membership check
        console2.log("Testing membership check...");
        assertEq(mockGovernor.hasVoted(newProposalId, user1), true);
        assertEq(mockGovernor.hasVoted(newProposalId, user2), false);
        assertEq(toad.isMember(user1, newProposalId), true);
        assertEq(toad.isMember(user2, newProposalId), false);
        console2.log("Membership checks completed successfully");
    }

    function testIsMemberNow() public {
        console2.log("Starting testIsMemberNow...");

        // Set up Tally Governor
        console2.log("Setting up Tally Governor...");
        toad.setTallyGovernor(address(mockGovernor));

        // Mint and delegate tokens
        console2.log("Minting and delegating tokens to user1...");
        mockToken.mint(user1, 1000);
        vm.prank(user1);
        mockToken.delegate(user1);
        console2.log("User1 voting power: %d", mockToken.getVotes(user1));

        // Create a proposal and vote
        console2.log("Creating proposal...");
        address[] memory targets = new address[](1);
        targets[0] = address(0);
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = "";
        uint256 newProposalId = mockGovernor.propose(
            targets,
            values,
            calldatas,
            "Proposal"
        );
        console2.log("Proposal created with ID: %d", newProposalId);

        // Wait for proposal to be active
        uint256 snapshot = mockGovernor.proposalSnapshot(newProposalId);
        console2.log("Proposal snapshot block: %d", snapshot);
        vm.roll(snapshot + 1);
        console2.log("Current block after delay: %d", block.number);

        // Vote on the proposal
        console2.log("User1 voting on proposal...");
        vm.prank(user1);
        mockGovernor.castVote(newProposalId, 1); // 1 = For
        console2.log("Vote cast successfully");

        // Discover proposal in TOAD
        console2.log("Discovering proposal in TOAD...");
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = newProposalId;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 100;
        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        // Test current membership check
        console2.log("Testing current membership check...");
        assertEq(mockGovernor.hasVoted(newProposalId, user1), true);
        assertEq(mockGovernor.hasVoted(newProposalId, user2), false);
        assertEq(toad.isMemberNow(user1), true);
        assertEq(toad.isMemberNow(user2), false);
        console2.log("Current membership checks completed successfully");
    }

    function test_RevertWhen_TallyGovernorNotSet() public {
        vm.expectRevert("Tally Governor not set");
        toad.isMember(user1, 100);
    }
}
