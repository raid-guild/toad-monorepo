# TOAD Wallet

TOAD Wallet is an automated governance voting system that interacts with OpenZeppelin Governor contracts to automatically vote on proposals based on predefined rules and API responses.

## Overview

The TOAD Wallet system is designed to:
- Monitor for new governance proposals
- Fetch voting decisions from the TOAD AI agent
- Automatically cast votes on proposals
- Handle rate limiting and error cases
- Support both production and debug modes

## Architecture

### Contracts

The system interacts with two main contracts:

1. **TOAD Contract**
   - Handles proposal discovery and management
   - Maintains a list of active proposals
   - Provides voting capabilities

2. **Governor Contract** (OpenZeppelin)
   - Manages the actual governance process
   - Handles proposal lifecycle
   - Executes votes and tracks voting power

### Components

- **ToadService**: Core service that manages proposal monitoring and voting
- **API Integration**: Fetches voting decisions from an AI agent
- **Transaction Simulation**: Supports debug mode for testing without actual transactions
- **Rate Limiting**: Prevents API abuse and respects rate limits

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Access to an Ethereum RPC endpoint
- Private key for the TOAD wallet
- Access to the [TOAD API endpoint](https://github.com/raid-guild/toad-ui)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/raid-guild/toad-wallet.git
cd toad-wallet
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the required environment variables (see below)

4. Build the project:
```bash
npm run build
```

5. Start the service:
```bash
npm start
```

For development:
```bash
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Wallet Configuration
TOAD_WALLET_PRIVATE_KEY=your_private_key_here

# Network Configuration
RPC_URL=your_ethereum_rpc_url

# Contract Addresses
TOAD=0x... # TOAD contract address
GOVERNOR_ADDRESS=0x... # Governor contract address

# API Configuration
TOAD_API_ENDPOINT=https://api.example.com

# Runtime Configuration
DEBUG_MODE=true # Set to false for production
RATE_LIMIT=10 # Maximum API calls per hour
```

### Contract Interaction Flow

1. **Proposal Discovery**
   - Service monitors for new proposals
   - Fetches proposal details from the blockchain
   - Validates proposal status and timing

2. **Voting Decision**
   - Queries the TOAD API for voting decisions
   - Receives vote direction and reason
   - Validates the response

3. **Vote Execution**
   - Submits vote to the Governor contract
   - Includes reason for the vote
   - Handles transaction simulation in debug mode

4. **Rate Limiting**
   - Tracks API call frequency
   - Implements exponential backoff
   - Respects API rate limits

## Development

### Testing

Run the test suite:
```bash
npm test
```

### Debug Mode

When `DEBUG_MODE=true`:
- All transactions are simulated instead of executed
- No actual votes are cast on-chain
- Useful for testing and development

### Error Handling

The system implements:
- Exponential backoff for API failures
- Transaction simulation for safety
- Comprehensive error logging
- Rate limit enforcement

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 