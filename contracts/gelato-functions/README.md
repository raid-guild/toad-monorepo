# TOAD Gelato Functions

This repository contains the Gelato Functions implementation for the TOAD contract's proposal discovery and answering automation.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
TOAD_CONTRACT_ADDRESS=your_contract_address
RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
```

3. Build the TypeScript files:
```bash
npx tsc
```

## Deployment to Gelato

1. Install Gelato CLI:
```bash
npm install -g @gelatonetwork/ops-cli
```

2. Login to Gelato:
```bash
gelato login
```

3. Deploy the functions:
```bash
# Deploy discoverProposals function
gelato deploy discoverProposalsFunction.ts --name "TOAD Discover Proposals" --schedule "0 0,12 * * *"

# Deploy answer function
gelato deploy answerFunction.ts --name "TOAD Answer Proposals" --schedule "0 0,12 * * *"
```

## Function Details

### discoverProposalsFunction
- Runs twice daily at 00:00 UTC and 12:00 UTC
- Fetches new proposals from toadn.com/api/proposals
- Calls the TOAD contract's discoverProposals function
- Returns execution data including transaction hash and number of proposals processed

### answerFunction
- Runs twice daily at 00:00 UTC and 12:00 UTC
- Gets active proposals from the TOAD contract
- Fetches answers from toadn.com/api/answer for each proposal
- Calls the TOAD contract's answer function
- Returns execution data including transaction hash and number of proposals answered

## Monitoring

Monitor function execution through the Gelato dashboard:
1. Log in to https://app.gelato.network
2. Navigate to the Functions section
3. Select the deployed functions to view execution history and logs

## Error Handling

Both functions include comprehensive error handling:
- API request failures
- Contract transaction failures
- Network issues
- Invalid data formats

Failed executions will be retried at the next scheduled time.

## Security

- Private keys are stored securely in environment variables
- API endpoints use HTTPS
- Contract calls are validated before execution
- Error messages are logged but don't expose sensitive information 