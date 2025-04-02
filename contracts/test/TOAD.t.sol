// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/console2.sol";
import {TOAD, ResultsAnnounced, AdminChanged, ToadChanged, ValidBlockIntervalChanged, TallyGovernorChanged, Proposal, ProposalView, Answer, CallerNotAdmin, CallerNotToad, CallerNotMember, ZeroAddressNotAllowed, ValidBlockIntervalMustBeGreaterThanZero, ArrayLengthsMustMatch, NoProposalsToAnswer, ProposalNotActiveForAnswering, ResultsAlreadyAnnounced, NoProposalsToClear, ProposalIndexOutOfBounds, ProposalStillActive, CallerHasNoVotingPower, ProposalNotActiveForDisabling, CallerAlreadyDisablingProposal, MemberHasNoVotingPower, EmptyArrayNotAllowed, TallyGovernorNotSet, VoteCast, DuplicateProposal} from "../src/TOAD.sol";
import "./mocks/MockGovernor.sol";
import "./mocks/MockToken.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract TOADTest is Test {
    TOAD public toad;
    address public admin;
    address public toadAddress;
    address public user1;
    address public user2;
    address public user3;
    address public user4;

    MockGovernor public mockGovernor;
    MockToken public mockToken;
    MockToken public token;
    uint256 public proposalId;
    uint256 public proposalId2;

    function setUp() public {
        admin = address(this);
        toadAddress = makeAddr("toad");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        user4 = makeAddr("user4");

        toad = new TOAD(toadAddress);
        mockToken = new MockToken();
        mockGovernor = new MockGovernor(IVotes(address(mockToken)));

        // Mint tokens to users
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
        vm.expectRevert(CallerNotAdmin.selector);
        toad.setAdmin(user2);
    }

    function test_RevertWhen_NonAdminSetsToad() public {
        vm.prank(user1);
        vm.expectRevert(CallerNotAdmin.selector);
        toad.setToad(user2);
    }

    function test_RevertWhen_NonAdminSetsValidBlockInterval() public {
        vm.prank(user1);
        vm.expectRevert(CallerNotAdmin.selector);
        toad.setValidBlockInterval(100);
    }

    function testDiscoverProposals() public {
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 1 days;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        vm.roll(block.number + 2 days);

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

        tallyIds = new uint[](2);
        tallyIds[0] = newProposalId1;
        tallyIds[1] = newProposalId2;
        votingPeriods = new uint[](2);
        votingPeriods[0] = 1 days;
        votingPeriods[1] = 2 days;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        ProposalView memory proposal1 = toad.getProposal(newProposalId1);
        ProposalView memory proposal2 = toad.getProposal(newProposalId2);

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
        toad.setTallyGovernor(address(mockGovernor));
        mockToken.mint(address(this), 1000);
        mockToken.mint(user1, 1000);

        mockToken.delegate(address(this));
        vm.prank(user1);
        mockToken.delegate(address(this));

        vm.roll(block.number + 1);

        address[] memory targets = new address[](1);
        targets[0] = address(0);
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = "";

        proposalId = mockGovernor.propose(
            targets,
            values,
            calldatas,
            "Test Proposal"
        );
        uint256 snapshot = mockGovernor.proposalSnapshot(proposalId);
        uint256 deadline = mockGovernor.proposalDeadline(proposalId);

        vm.roll(snapshot + 1);

        uint[] memory discoveryIds = new uint[](1);
        discoveryIds[0] = proposalId;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 10;

        vm.prank(toadAddress);
        toad.discoverProposals(discoveryIds, votingPeriods);

        toad.setValidBlockInterval(5);

        vm.prank(user1);
        mockGovernor.castVote(proposalId, 1);

        vm.roll(deadline + 1);

        Answer[] memory answers = new Answer[](1);
        answers[0] = Answer.FOR;
        string[] memory reasons = new string[](1);
        reasons[0] = "Supporting the proposal for better governance";

        vm.prank(toadAddress);
        toad.answer(discoveryIds, answers, reasons);

        ProposalView memory proposal = toad.getProposal(proposalId);
        assertEq(uint(proposal.answer), uint(Answer.FOR));
        assertEq(proposal.reason, reasons[0]);
    }

    function testAnnounceResults() public {
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 1 days;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        toad.setValidBlockInterval(100);

        Answer[] memory answers = new Answer[](1);
        answers[0] = Answer.FOR;
        string[] memory reasons = new string[](1);
        reasons[0] = "Supporting the proposal for better governance";

        vm.prank(toadAddress);
        toad.answer(tallyIds, answers, reasons);

        uint[] memory indexes = new uint[](1);
        indexes[0] = 0;
        vm.roll(toad.getProposal(1).validBlock + 5);

        vm.expectEmit(true, true, true, true);
        emit ResultsAnnounced(1, Answer.FOR);

        vm.prank(toadAddress);
        toad.announceResults(indexes);

        ProposalView memory proposal = toad.getProposal(1);
        assertEq(proposal.announced, true);
        assertEq(proposal.reason, reasons[0]);
    }

    function testDisable() public {
        toad.setTallyGovernor(address(mockGovernor));

        vm.roll(block.number + 1);
        uint decidingPower = 2000;
        mockToken.mint(user3, decidingPower);

        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 5;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        toad.setValidBlockInterval(2);

        // First delegate to self to establish voting power
        vm.prank(user3);
        mockToken.delegate(user3);
        vm.roll(block.number + 1);

        // Then set disable power
        vm.prank(user3);
        toad.setDisablePower(tallyIds);

        // Finally delegate to TOAD contract
        vm.prank(user3);
        mockToken.delegate(address(toad));
        vm.roll(block.number + 1);

        vm.prank(user3);
        toad.toggle(tallyIds, user3);
    }

    function testClearProposal() public {
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 1 days;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        vm.roll(block.number + 2 days);

        vm.prank(toadAddress);
        toad.clearProposalByTallyId(tallyIds[0]);

        ProposalView memory proposal = toad.getProposal(1);
        assertEq(proposal.tallyId, 0);
        assertEq(proposal.discoveredAt, 0);
        assertEq(proposal.validBlock, 0);
        assertEq(proposal.votingPeriod, 0);
        assertEq(proposal.announced, false);
        assertEq(proposal.disablePower, 0);
    }

    function testCanVote_NoDisablers() public {
        toad.setTallyGovernor(address(mockGovernor));
        mockToken.mint(toadAddress, 2000);
        mockToken.mint(user1, 1000);
        mockToken.mint(user2, 2000);

        vm.roll(block.number + 1);

        vm.prank(toadAddress);
        mockToken.delegate(address(toad));
        vm.prank(user1);
        mockToken.delegate(address(toad));
        vm.prank(user2);
        mockToken.delegate(address(toad));

        vm.roll(block.number + 1);

        address[] memory targets = new address[](1);
        targets[0] = address(0);
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = "";

        uint newProposalId = mockGovernor.propose(
            targets,
            values,
            calldatas,
            ""
        );
        uint snapshot = mockGovernor.proposalSnapshot(newProposalId);

        vm.roll(snapshot + 1);

        toad.setValidBlockInterval(5);

        uint[] memory discoveryIds = new uint[](1);
        discoveryIds[0] = newProposalId;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 5;

        vm.prank(toadAddress);
        toad.discoverProposals(discoveryIds, votingPeriods);

        ProposalView memory proposal = toad.getProposal(newProposalId);
        vm.roll(proposal.validBlock + 2);

        bool[] memory results = toad.canVote(discoveryIds);
        assertEq(
            results[0],
            true,
            "TOAD should be able to vote with no disablers"
        );
    }

    function testCanVote_WithDisabler() public {
        toad.setTallyGovernor(address(mockGovernor));

        mockToken.mint(toadAddress, 2000);
        mockToken.mint(user1, 1000);
        mockToken.mint(user2, 2000);
        mockToken.mint(user3, 10000);

        vm.prank(toadAddress);
        mockToken.delegate(address(toad));
        vm.prank(user1);
        mockToken.delegate(address(toad));
        vm.prank(user2);
        mockToken.delegate(address(toad));

        // Wait for delegation to be active
        vm.roll(block.number + 1);

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
            "Test Proposal"
        );
        uint256 snapshot = mockGovernor.proposalSnapshot(newProposalId);
        uint256 deadline = mockGovernor.proposalDeadline(newProposalId);

        vm.roll(snapshot + 1);

        toad.setValidBlockInterval(5);

        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = newProposalId;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = deadline - block.number;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        ProposalView memory proposal = toad.getProposal(newProposalId);

        vm.roll(proposal.validBlock - 3);

        vm.roll(block.number + 1);

        vm.prank(user3);
        mockToken.delegate(user3);

        vm.prank(user3);
        toad.setDisablePower(tallyIds);

        vm.prank(user3);
        mockToken.delegate(address(toad));

        vm.prank(user3);
        toad.toggle(tallyIds, user3);

        vm.roll(block.number + 1);
        vm.roll(proposal.validBlock + 2);

        bool[] memory results = toad.canVote(tallyIds);
        assertEq(
            results[0],
            false,
            "TOAD should not be able to vote when disabled by a delegator with more voting power"
        );
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
        vm.expectRevert(CallerNotAdmin.selector);
        toad.setTallyGovernor(address(mockGovernor));
    }

    function test_RevertWhen_ZeroAddressSetsTallyGovernor() public {
        vm.expectRevert(ZeroAddressNotAllowed.selector);
        toad.setTallyGovernor(address(0));
    }

    function test_RevertWhen_TallyGovernorNotSet() public {
        vm.expectRevert(TallyGovernorNotSet.selector);
        toad.isMember(user1);
    }

    function test_RevertWhen_ClearingNonExistentProposal() public {
        vm.prank(toadAddress);
        vm.expectRevert(ProposalIndexOutOfBounds.selector);
        toad.clearProposalByTallyId(999);
    }

    function test_RevertWhen_ClearingActiveProposal() public {
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 1 days;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        vm.prank(toadAddress);
        vm.expectRevert(ProposalStillActive.selector);
        toad.clearProposalByTallyId(tallyIds[0]);
    }

    function test_RevertWhen_AnsweringAfterValidBlock() public {
        toad.setTallyGovernor(address(mockGovernor));
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 5;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        toad.setValidBlockInterval(2);
        vm.roll(toad.getProposal(1).validBlock + 3);

        Answer[] memory answers = new Answer[](1);
        answers[0] = Answer.FOR;

        string[] memory reasons = new string[](1);
        reasons[0] = "Test reason";

        vm.prank(toadAddress);
        vm.expectRevert(ProposalNotActiveForAnswering.selector);
        toad.answer(tallyIds, answers, reasons);
    }

    function test_RevertWhen_AnnouncingResultsTwice() public {
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 1 days;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        Answer[] memory answers = new Answer[](1);
        answers[0] = Answer.FOR;

        string[] memory reasons = new string[](1);
        reasons[0] = "Test reason";

        vm.prank(toadAddress);
        toad.answer(tallyIds, answers, reasons);

        uint[] memory indexes = new uint[](1);
        indexes[0] = 0;

        vm.prank(toadAddress);
        toad.announceResults(indexes);

        vm.prank(toadAddress);
        vm.expectRevert(ResultsAlreadyAnnounced.selector);
        toad.announceResults(indexes);
    }

    function test_RevertWhen_DiscoveringProposalsWithMismatchedArrays() public {
        uint[] memory tallyIds = new uint[](2);
        tallyIds[0] = 1;
        tallyIds[1] = 2;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 1 days;

        vm.prank(toadAddress);
        vm.expectRevert(ArrayLengthsMustMatch.selector);
        toad.discoverProposals(tallyIds, votingPeriods);
    }

    function test_RevertWhen_SettingDisablePowerWithZeroVotingPower() public {
        toad.setTallyGovernor(address(mockGovernor));

        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 5;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        mockToken.mint(user3, 0);

        vm.prank(user3);
        mockToken.delegate(address(toad));

        vm.prank(user3);
        vm.expectRevert(CallerHasNoVotingPower.selector);
        toad.setDisablePower(tallyIds);
    }

    function test_RevertWhen_SettingDisablePowerAfterValidBlock() public {
        toad.setTallyGovernor(address(mockGovernor));

        vm.roll(block.number + 1);
        uint decidingPower = 2000;
        mockToken.mint(user3, decidingPower);

        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 5;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        toad.setValidBlockInterval(2);

        // First delegate to self to establish voting power
        vm.prank(user3);
        mockToken.delegate(user3);
        vm.roll(block.number + 1);

        // Get the proposal to check its valid block
        ProposalView memory proposal = toad.getProposal(1);

        // Roll past valid block
        vm.roll(proposal.validBlock + 1);

        // Try to set disable power after valid block
        vm.expectRevert(ProposalNotActiveForDisabling.selector);
        vm.prank(user3);
        toad.setDisablePower(tallyIds);
    }

    function test_RevertWhen_SettingDisablePowerTwice() public {
        toad.setTallyGovernor(address(mockGovernor));

        vm.roll(block.number + 1);
        uint decidingPower = 2000;
        mockToken.mint(user3, decidingPower);

        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 5;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        toad.setValidBlockInterval(2);

        // First delegate to self to establish voting power
        vm.prank(user3);
        mockToken.delegate(user3);
        vm.roll(block.number + 1);

        // Then set disable power
        vm.prank(user3);
        toad.setDisablePower(tallyIds);

        // Try to set disable power again (should fail)
        vm.expectRevert(CallerAlreadyDisablingProposal.selector);
        vm.prank(user3);
        toad.setDisablePower(tallyIds);
    }

    function test_RevertWhen_TogglingNonExistentProposal() public {
        toad.setTallyGovernor(address(mockGovernor));
        mockToken.mint(user1, 1000);
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 999;

        vm.prank(user1);
        vm.expectRevert(MemberHasNoVotingPower.selector);
        toad.toggle(tallyIds, user1);
    }

    function test_DisablePowerAfterDelegation() public {
        toad.setTallyGovernor(address(mockGovernor));

        vm.roll(block.number + 1);
        uint decidingPower = 2000;
        mockToken.mint(user3, decidingPower);

        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 5;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        toad.setValidBlockInterval(2);

        // First delegate to self to establish voting power
        vm.prank(user3);
        mockToken.delegate(user3);
        vm.roll(block.number + 1);

        // Then set disable power
        vm.prank(user3);
        toad.setDisablePower(tallyIds);

        // Finally delegate to TOAD contract
        vm.prank(user3);
        mockToken.delegate(address(toad));
        vm.roll(block.number + 1);

        vm.prank(user3);
        toad.toggle(tallyIds, user3);
    }

    function test_DisablePowerAfterRevokingDelegation() public {
        toad.setTallyGovernor(address(mockGovernor));

        vm.roll(block.number + 1);
        uint decidingPower = 2000;
        mockToken.mint(user3, decidingPower);

        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 5;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        toad.setValidBlockInterval(2);

        // First delegate to self to establish voting power
        vm.prank(user3);
        mockToken.delegate(user3);
        vm.roll(block.number + 1);

        // Then set disable power
        vm.prank(user3);
        toad.setDisablePower(tallyIds);

        // Finally delegate to TOAD contract
        vm.prank(user3);
        mockToken.delegate(address(toad));
        vm.roll(block.number + 1);

        vm.prank(user3);
        toad.toggle(tallyIds, user3);
    }

    function test_CheckingVotingPowerBeforeValidBlock() public {
        toad.setTallyGovernor(address(mockGovernor));
        mockToken.mint(toadAddress, 2000);
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 5;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        toad.setValidBlockInterval(2);
        ProposalView memory proposal = toad.getProposal(1);

        vm.roll(proposal.validBlock - 1);
        assertEq(toad.canVote(tallyIds)[0], false);

        vm.roll(proposal.validBlock);
        assertEq(toad.canVote(tallyIds)[0], false);

        vm.roll(proposal.validBlock + 1);
        bool[] memory results = toad.canVote(tallyIds);
        assertEq(
            results[0],
            true,
            "Should be able to check voting power after valid block"
        );
    }

    function test_MultipleProposalsWithDifferentValidBlocks() public {
        toad.setTallyGovernor(address(mockGovernor));
        mockToken.mint(toadAddress, 2000);

        uint[] memory tallyIds = new uint[](2);
        tallyIds[0] = 1;
        tallyIds[1] = 2;
        uint[] memory votingPeriods = new uint[](2);
        votingPeriods[0] = 5;
        votingPeriods[1] = 10;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        toad.setValidBlockInterval(2);
        ProposalView memory proposal1 = toad.getProposal(1);
        ProposalView memory proposal2 = toad.getProposal(2);

        vm.roll(proposal1.validBlock + 1);

        vm.roll(proposal2.validBlock + 1);

        bool[] memory results = toad.canVote(tallyIds);
        assertEq(results[0], true, "First proposal should be votable");
        assertEq(results[1], true, "Second proposal should be votable");
    }

    function test_Vote() public {
        toad.setTallyGovernor(address(mockGovernor));
        mockToken.mint(toadAddress, 2000);

        vm.prank(toadAddress);
        mockToken.delegate(address(toad));

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
            "Test Proposal"
        );
        uint256 snapshot = mockGovernor.proposalSnapshot(newProposalId);
        uint256 deadline = mockGovernor.proposalDeadline(newProposalId);

        vm.roll(snapshot + 1);

        toad.setValidBlockInterval(5);

        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = newProposalId;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = deadline - block.number;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        Answer[] memory answers = new Answer[](1);
        answers[0] = Answer.FOR;
        string[] memory reasons = new string[](1);
        reasons[0] = "Supporting the proposal for better governance";

        vm.prank(toadAddress);
        toad.answer(tallyIds, answers, reasons);

        ProposalView memory proposal = toad.getProposal(newProposalId);

        vm.roll(proposal.validBlock + 1);

        vm.prank(toadAddress);
        vm.expectEmit(true, true, true, true);
        emit VoteCast(newProposalId, Answer.FOR, reasons[0]);
        toad.vote(tallyIds);

        assertEq(
            mockGovernor.hasVoted(newProposalId, address(toad)),
            true,
            "Proposal should be voted"
        );
    }

    function test_VoteWithMultipleProposals() public {
        toad.setTallyGovernor(address(mockGovernor));
        mockToken.mint(toadAddress, 2000);

        vm.prank(toadAddress);
        mockToken.delegate(address(toad));

        address[] memory targets = new address[](1);
        targets[0] = address(0);
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = "";

        uint256 newProposalId1 = mockGovernor.propose(
            targets,
            values,
            calldatas,
            "Test Proposal 1"
        );
        uint256 newProposalId2 = mockGovernor.propose(
            targets,
            values,
            calldatas,
            "Test Proposal 2"
        );

        uint256 snapshot1 = mockGovernor.proposalSnapshot(newProposalId1);
        uint256 deadline1 = mockGovernor.proposalDeadline(newProposalId1);
        uint256 snapshot2 = mockGovernor.proposalSnapshot(newProposalId2);
        uint256 deadline2 = mockGovernor.proposalDeadline(newProposalId2);

        vm.roll(Math.max(snapshot1, snapshot2) + 1);

        toad.setValidBlockInterval(5);

        uint[] memory tallyIds = new uint[](2);
        tallyIds[0] = newProposalId1;
        tallyIds[1] = newProposalId2;
        uint[] memory votingPeriods = new uint[](2);
        votingPeriods[0] = deadline1 - block.number;
        votingPeriods[1] = deadline2 - block.number;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        Answer[] memory answers = new Answer[](2);
        answers[0] = Answer.FOR;
        answers[1] = Answer.AGAINST;
        string[] memory reasons = new string[](2);
        reasons[0] = "Supporting proposal 1 for better governance";
        reasons[1] = "Opposing proposal 2 due to concerns";

        vm.prank(toadAddress);
        toad.answer(tallyIds, answers, reasons);

        ProposalView memory proposal1 = toad.getProposal(newProposalId1);
        ProposalView memory proposal2 = toad.getProposal(newProposalId2);
        vm.roll(Math.max(proposal1.validBlock, proposal2.validBlock) + 1);

        vm.prank(toadAddress);
        vm.expectEmit(true, true, true, true);
        emit VoteCast(newProposalId1, Answer.FOR, reasons[0]);
        vm.expectEmit(true, true, true, true);
        emit VoteCast(newProposalId2, Answer.AGAINST, reasons[1]);
        toad.vote(tallyIds);

        assertEq(
            mockGovernor.hasVoted(newProposalId1, address(toad)),
            true,
            "Proposal 1 should be voted"
        );
        assertEq(
            mockGovernor.hasVoted(newProposalId2, address(toad)),
            true,
            "Proposal 2 should be voted"
        );
    }

    function test_RevertWhen_VotingWithMismatchedArrays() public {
        toad.setTallyGovernor(address(mockGovernor));
        mockToken.mint(toadAddress, 2000);

        vm.prank(toadAddress);
        mockToken.delegate(address(toad));

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
            "Test Proposal"
        );

        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = newProposalId;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 5;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        Answer[] memory answers = new Answer[](1);
        answers[0] = Answer.FOR;
        string[] memory reasons = new string[](2);
        reasons[0] = "Reason 1";
        reasons[1] = "Reason 2";

        vm.prank(toadAddress);
        vm.expectRevert(ArrayLengthsMustMatch.selector);
        toad.answer(tallyIds, answers, reasons);
    }

    function test_RevertWhen_VotingBeforeValidBlock() public {
        toad.setTallyGovernor(address(mockGovernor));
        mockToken.mint(toadAddress, 2000);

        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 5;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        Answer[] memory answers = new Answer[](1);
        answers[0] = Answer.FOR;

        string[] memory reasons = new string[](1);
        reasons[0] = "Test reason";

        vm.prank(toadAddress);
        toad.answer(tallyIds, answers, reasons);

        vm.prank(toadAddress);
        vm.expectRevert(ProposalNotActiveForAnswering.selector);
        toad.vote(tallyIds);
    }

    function test_RevertWhen_VotingWhenDisabled() public {
        toad.setTallyGovernor(address(mockGovernor));
        mockToken.mint(toadAddress, 2000);
        mockToken.mint(user1, 3000);

        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 5;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        Answer[] memory answers = new Answer[](1);
        answers[0] = Answer.FOR;
        string[] memory reasons = new string[](1);
        reasons[0] = "Test reason";

        vm.prank(toadAddress);
        toad.answer(tallyIds, answers, reasons);

        toad.setValidBlockInterval(2);

        // First delegate to self to establish voting power
        vm.prank(user1);
        mockToken.delegate(user1);
        vm.roll(block.number + 1);

        // Then set disable power
        vm.prank(user1);
        toad.setDisablePower(tallyIds);

        // Finally delegate to TOAD contract
        vm.prank(user1);
        mockToken.delegate(address(toad));
        vm.roll(block.number + 1);

        // Toggle the disable
        vm.prank(user1);
        toad.toggle(tallyIds, user1);

        // Get the proposal to check its valid block
        ProposalView memory proposal = toad.getProposal(1);

        // Roll to valid block
        vm.roll(proposal.validBlock + 1);

        // Try to vote when disabled
        vm.prank(toadAddress);
        vm.expectRevert(ProposalNotActiveForAnswering.selector);
        toad.vote(tallyIds);
    }

    function test_RevertWhen_NonToadVoting() public {
        toad.setTallyGovernor(address(mockGovernor));
        mockToken.mint(toadAddress, 2000);

        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 5;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        Answer[] memory answers = new Answer[](1);
        answers[0] = Answer.FOR;

        string[] memory reasons = new string[](1);
        reasons[0] = "Test reason";

        vm.prank(toadAddress);
        toad.answer(tallyIds, answers, reasons);

        toad.setValidBlockInterval(2);
        vm.roll(block.number + 3);

        vm.prank(user1);
        vm.expectRevert(CallerNotToad.selector);
        toad.vote(tallyIds);
    }

    function test_RevertWhen_DiscoveringDuplicateProposals() public {
        uint[] memory tallyIds = new uint[](1);
        tallyIds[0] = 1;
        uint[] memory votingPeriods = new uint[](1);
        votingPeriods[0] = 1 days;

        vm.prank(toadAddress);
        toad.discoverProposals(tallyIds, votingPeriods);

        // Try to discover the same proposal again
        vm.prank(toadAddress);
        vm.expectRevert(DuplicateProposal.selector);
        toad.discoverProposals(tallyIds, votingPeriods);
    }

    function test_RevertWhen_VotingWithEmptyArray() public {
        toad.setTallyGovernor(address(mockGovernor));
        mockToken.mint(toadAddress, 2000);

        uint[] memory tallyIds = new uint[](0);
        vm.prank(toadAddress);
        vm.expectRevert(EmptyArrayNotAllowed.selector);
        toad.vote(tallyIds);
    }
}
