// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import {Script, console2} from "forge-std/Script.sol";
import {TOAD} from "../toad.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address toadAddress = vm.envAddress("TOAD_ADDRESS");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TOAD contract
        TOAD toad = new TOAD(toadAddress);
        console2.log("TOAD deployed to:", address(toad));

        // Set Tally Governor if provided
        address tallyGovernor = vm.envOr("TALLY_GOVERNOR", address(0));
        if (tallyGovernor != address(0)) {
            toad.setTallyGovernor(tallyGovernor);
            console2.log("Tally Governor set to:", tallyGovernor);
        }

        // Set valid block interval if provided
        uint96 validBlockInterval = uint96(
            vm.envOr("VALID_BLOCK_INTERVAL", uint256(1 days))
        );
        toad.setValidBlockInterval(validBlockInterval);
        console2.log("Valid block interval set to:", validBlockInterval);

        vm.stopBroadcast();
    }
}
