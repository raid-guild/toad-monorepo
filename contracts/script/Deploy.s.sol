// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "forge-std/Script.sol";
import "../src/TOAD.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";

contract TallyGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction
{
    constructor(
        string memory _name,
        IVotes _token,
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _proposalThreshold,
        uint256 _quorumPercentage
    )
        Governor(_name)
        GovernorSettings(
            uint48(_votingDelay),
            uint32(_votingPeriod),
            _proposalThreshold
        )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(_quorumPercentage)
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

    function quorum(
        uint256 blockNumber
    )
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
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

contract VotesToken is ERC20, ERC20Permit, ERC20Votes {
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) ERC20Permit(_name) ERC20Votes() {}

    // The following functions are overrides required by Solidity.
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20, ERC20Votes) {
        super._update(from, to, amount);
    }

    function nonces(
        address owner
    ) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract DeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address toadAddress = vm.envAddress("TOAD_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the governance token
        VotesToken token = new VotesToken("TOAD DAO Token", "TOAD");

        // Deploy the Tally governor
        // Parameters for Sepolia:
        // - name: "TOAD DAO Governor"
        // - token: The governance token
        // - votingDelay: 7200 blocks (~1 day with 12s blocks)
        // - votingPeriod: 50400 blocks (~1 week with 12s blocks)
        // - proposalThreshold: 100000 * 10**18 (100k tokens)
        // - quorumPercentage: 4 (4% quorum)
        TallyGovernor governor = new TallyGovernor(
            "TOAD DAO Governor",
            IVotes(address(token)),
            7200,
            50400,
            100000 * 10 ** 18,
            4
        );

        // Deploy TOAD with the address from environment
        TOAD toad = new TOAD(toadAddress);

        // Set the Tally governor in TOAD
        toad.setTallyGovernor(address(governor));

        // Mint initial tokens:
        // - 1M tokens to TOAD for voting
        // - 500k tokens to deployer for testing
        token.mint(address(toad), 1000000 * 10 ** 18);
        token.mint(
            address(0x683973bF95D9E24aA8a5b619d229b95a63641DFa),
            500000 * 10 ** 18
        );

        vm.stopBroadcast();

        // Log the deployed addresses
        console2.log("Network: Sepolia");
        console2.log("TOAD DAO Token deployed to:", address(token));
        console2.log("TOAD DAO Governor deployed to:", address(governor));
        console2.log("TOAD deployed to:", address(toad));
        console2.log("Using TOAD address:", toadAddress);
        console2.log("Deployer address:", msg.sender);
    }
}
