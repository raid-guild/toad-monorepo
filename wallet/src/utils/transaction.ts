import { ethers } from 'ethers';
import { DEBUG_MODE } from '../constants';

/**
 * Simulates a transaction without sending it
 * @param contract The contract instance
 * @param method The method to call
 * @param args The arguments to pass to the method
 * @param provider The provider instance
 * @param wallet The wallet instance
 * @returns The simulation result
 */
export async function simulateTransaction(
    contract: ethers.Contract,
    method: string,
    args: any[],
    provider: ethers.JsonRpcProvider,
    wallet: ethers.Wallet
): Promise<void> {
    try {
        console.log(`\n=== Simulating Transaction ===`);
        console.log(`Method: ${method}`);
        console.log(`Arguments:`, args);

        // Get the function fragment
        const functionFragment = contract.interface.getFunction(method);
        if (!functionFragment) {
            throw new Error(`Method ${method} not found in contract`);
        }

        // Create the transaction data
        const data = contract.interface.encodeFunctionData(functionFragment, args);

        // Simulate the transaction
        const simulation = await provider.call({
            to: contract.target,
            data,
            from: wallet.address
        });

        console.log(`Simulation successful`);
        console.log(`Gas estimate: ${simulation}`);
        console.log(`=== Simulation Complete ===\n`);
    } catch (error) {
        console.error(`Simulation failed:`, error);
        throw error;
    }
}

/**
 * Executes or simulates a transaction based on debug mode
 * @param contract The contract instance
 * @param method The method to call
 * @param args The arguments to pass to the method
 * @param provider The provider instance
 * @param wallet The wallet instance
 * @returns The transaction result
 */
export async function executeOrSimulateTransaction(
    contract: ethers.Contract,
    method: string,
    args: any[],
    provider: ethers.JsonRpcProvider,
    wallet: ethers.Wallet
): Promise<any> {
    if (DEBUG_MODE) {
        await simulateTransaction(contract, method, args, provider, wallet);
        return { wait: async () => { } }; // Return a mock transaction
    }

    const tx = await contract[method](...args);
    return tx;
} 