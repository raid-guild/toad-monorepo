# TOAD (Trustless Onchain Autonomous Delegate)

TOAD is a smart contract system that implements a trustless onchain autonomous delegate for governance voting. It allows token holders to delegate their voting power to an autonomous system while maintaining the ability to override the system's decisions through a collective disable mechanism.

## Smart Contract Overview

The TOAD contract implements a sophisticated governance system with the following key features:

- **Autonomous Voting**: TOAD can autonomously vote on governance proposals
- **Disable Mechanism**: Token holders can collectively disable TOAD's voting power
- **Trustless Design**: No single entity has control over the system
- **Gas-Efficient**: Optimized for minimal gas usage
- **OpenZeppelin Integration**: Built on top of OpenZeppelin's Governor and ERC20Votes contracts

### Key Components

1. **Proposal Management**
   - Discovery of new proposals
   - Answer recording
   - Results announcement
   - Proposal clearing

2. **Voting Power Management**
   - Delegation tracking
   - Voting power calculation
   - Disable power accumulation

## Prerequisites

- Foundry (forge, cast, anvil)
- An Ethereum wallet (e.g., MetaMask)
- Access to an Ethereum node (local or through a provider like Infura/Alchemy)

## Environment Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd toad-contracts
```

2. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

3. Install dependencies:
```bash
forge install
```

4. Create a `.env` file in the root directory with the following variables:
```env
PRIVATE_KEY=your_private_key_here
TOAD_ADDRESS=your_toad_address
TALLY_GOVERNOR=your_tally_governor_address
VALID_BLOCK_INTERVAL=your_block_interval
# Network RPC URLs and API keys
OPTIMISM_RPC_URL=your_optimism_rpc_url
ARBITRUM_RPC_URL=your_arbitrum_rpc_url
POLYGON_RPC_URL=your_polygon_rpc_url
OPTIMISM_ETHERSCAN_API_KEY=your_optimism_api_key
ARBITRUM_ETHERSCAN_API_KEY=your_arbitrum_api_key
POLYGONSCAN_API_KEY=your_polygon_api_key
```

## Development

1. Compile the contracts:
```bash
forge build
```

2. Run tests:
```bash
forge test
```

3. Run specific tests with verbosity:
```bash
forge test -vv
```

## Deployment

The project supports deployment to multiple networks:

- Optimism
- Arbitrum
- Polygon

To deploy:

1. Make the deployment script executable:
```bash
chmod +x deploy.sh
```

2. Run the deployment:
```bash
./deploy.sh
```

The script will automatically deploy to networks based on the environment variables set in your `.env` file.

For detailed deployment instructions, see [DEPLOY.md](DEPLOY.md).

## Security Considerations

- The contract uses OpenZeppelin's battle-tested contracts
- All external functions have appropriate access controls
- Input validation is implemented for all user inputs
- Gas optimization techniques are employed throughout the code

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For security concerns, please contact the security team at [email to be added]. 