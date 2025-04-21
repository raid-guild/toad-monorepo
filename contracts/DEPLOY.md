# TOAD Deployment Guide

This guide explains how to deploy the TOAD contract to Optimism, Arbitrum, and Polygon networks.

## Prerequisites

1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Install required tools:
```bash
# Install jq for JSON processing
sudo apt-get install jq  # For Ubuntu/Debian
brew install jq         # For macOS
```

## Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your values:
- `PRIVATE_KEY`: Your deployer private key (without 0x prefix)
- `TOAD_ADDRESS`: The EOA that will control TOAD
- `TALLY_GOVERNOR`: (Optional) The Tally Governor contract address
- `VALID_BLOCK_INTERVAL`: (Optional) The valid block interval in blocks (default: 1 day)
- Network RPC URLs and API keys for the networks you want to deploy to

## Deployment

1. Make the deployment script executable:
```bash
chmod +x deploy.sh
```

2. Run the deployment:
```bash
./deploy.sh
```

The script will:
- Deploy to Optimism if `OPTIMISM_RPC_URL` and `OPTIMISM_ETHERSCAN_API_KEY` are set
- Deploy to Arbitrum if `ARBITRUM_RPC_URL` and `ARBITRUM_ETHERSCAN_API_KEY` are set
- Deploy to Polygon if `POLYGON_RPC_URL` and `POLYGONSCAN_API_KEY` are set

## Network Information

### Optimism
- RPC URL: Use an Optimism RPC provider (e.g., Alchemy, Infura)
- Etherscan API Key: Get from [Optimistic Etherscan](https://optimistic.etherscan.io/apis)

### Arbitrum
- RPC URL: Use an Arbitrum RPC provider (e.g., Alchemy, Infura)
- Etherscan API Key: Get from [Arbiscan](https://arbiscan.io/apis)

### Polygon
- RPC URL: Use a Polygon RPC provider (e.g., Alchemy, Infura)
- Etherscan API Key: Get from [PolygonScan](https://polygonscan.com/apis)

## Verification

The deployment script automatically verifies the contract on each network's block explorer. You can verify manually using:

```bash
forge verify-contract <DEPLOYED_ADDRESS> TOAD --chain <NETWORK> --watch
```

## Post-Deployment

After deployment:
1. Verify the contract on the block explorer
2. Set the Tally Governor if not set during deployment
3. Configure the valid block interval if needed
4. Test the contract's functionality on each network

## Security Notes

- Never commit your `.env` file
- Keep your private key secure
- Double-check all addresses before deployment
- Consider using a multisig for admin functions 