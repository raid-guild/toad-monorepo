import { ToadService } from './services/ToadService';
/**
 * Main entry point for the TOAD wallet application
 */
async function main() {
    try {
        console.log('Starting TOAD wallet...');

        const toadService = new ToadService();

        // Start listening for new proposals
        await toadService.startProposalListener();
        console.log('Started listening for new proposals');

        // Start daily check for active proposals
        toadService.startDailyCheck();
        console.log('Started daily check for active proposals');

        // Keep the process running
        process.on('SIGINT', () => {
            console.log('Shutting down TOAD wallet...');
            process.exit(0);
        });
    } catch (error) {
        console.error('Error starting TOAD wallet:', error);
        process.exit(1);
    }
}

main(); 