// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import "forge-std/Script.sol";
import "../src/TOAD.sol";

contract DeployTOADScript is Script {
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address toadAddress = vm.envAddress("TOAD_ADDRESS");
        address tallyGovernor = vm.envAddress("TALLY_GOVERNOR");
        uint256 validBlockInterval = vm.envUint("VALID_BLOCK_INTERVAL");

        // Start broadcasting
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TOAD
        TOAD toad = new TOAD(toadAddress);

        // Set Tally Governor
        toad.setTallyGovernor(tallyGovernor);

        // Set valid block interval if provided
        if (validBlockInterval > 0) {
            toad.setValidBlockInterval(validBlockInterval);
        }

        // Stop broadcasting
        vm.stopBroadcast();

        // Log deployed addresses
        console.log("TOAD deployed at:", address(toad));
        console.log("Tally Governor set to:", tallyGovernor);
        console.log("TOAD address set to:", toadAddress);
        if (validBlockInterval > 0) {
            console.log("Valid block interval set to:", validBlockInterval);
        }
    }
}
