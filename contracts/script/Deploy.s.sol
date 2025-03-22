// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "forge-std/Script.sol";
import "../src/TOAD.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";

contract TallyGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes
{
    constructor(
        string memory _name,
        IVotes _token,
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _proposalThreshold
    )
        Governor(_name)
        GovernorSettings(_votingDelay, _votingPeriod, _proposalThreshold)
        GovernorVotes(_token)
    {}

    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256) public pure override returns (uint256) {
        return 0; // No quorum required for testing
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }
}

contract VotesToken is ERC20Votes {
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) ERC20Permit(_name) {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract DeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the governance token
        VotesToken token = new VotesToken("Governance Token", "GOV");

        // Deploy the Tally governor
        // Parameters:
        // - name: "Tally Governor"
        // - token: The governance token
        // - votingDelay: 1 block (for testing)
        // - votingPeriod: 300 blocks (~1 hour with 12s blocks)
        // - proposalThreshold: 0 (no threshold for testing)
        TallyGovernor governor = new TallyGovernor(
            "Tally Governor",
            IVotes(address(token)),
            1,
            300,
            0
        );

        // Deploy TOAD with a designated TOAD address
        address toadAddress = address(0x1234); // Replace with actual TOAD address
        TOAD toad = new TOAD(toadAddress);

        // Set the Tally governor in TOAD
        toad.setTallyGovernor(address(governor));

        // Mint initial tokens to TOAD for testing
        token.mint(address(toad), 1000000 * 10 ** 18);

        vm.stopBroadcast();

        // Log the deployed addresses
        console2.log("Governance Token deployed to:", address(token));
        console2.log("Tally Governor deployed to:", address(governor));
        console2.log("TOAD deployed to:", address(toad));
    }
}
