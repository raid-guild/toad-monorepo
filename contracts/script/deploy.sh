#!/bin/bash

# Exit if any command fails
set -e

# Function to print usage
print_usage() {
    echo "Usage: $0 [--dev|--prod]"
    echo "  --dev   Deploy to Polygon Amoy (development)"
    echo "  --prod  Deploy to Ethereum, Polygon, and Arbitrum (production)"
}

# Check if deployment mode is specified
if [ $# -eq 0 ]; then
    print_usage
    exit 1
fi

# Parse command line arguments
MODE=$1

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "Initial commit"
fi

# Clean install dependencies
rm -rf lib
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge install foundry-rs/forge-std --no-commit

# Build the contracts
forge build

# Check if .env file exists, if not create it from example
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "Created .env file from .env.example"
        echo "Please edit .env file with your private keys and API keys"
        exit 1
    else
        echo "No .env or .env.example file found"
        exit 1
    fi
fi

# Load environment variables
source .env

# Verify required environment variables
if [ -z "$PRIVATE_KEY" ]; then
    echo "PRIVATE_KEY not set in .env file"
    exit 1
fi

# Function to deploy to a specific network
deploy_to_network() {
    local network=$1
    local rpc_url=$2
    local chain_id=$3
    local verify_flag=$4

    echo "Deploying to $network..."
    
    forge script script/Deploy.s.sol:DeployScript \
        --rpc-url "$rpc_url" \
        --chain-id "$chain_id" \
        --private-key "$PRIVATE_KEY" \
        --broadcast \
        $verify_flag \
        --legacy \
        -vvvv
}

case $MODE in
    --dev)
        # Development deployment (Polygon Amoy)
        deploy_to_network "Polygon Amoy" \
            "https://rpc-amoy.polygon.technology" \
            "80002" \
            "--verify"
        ;;
    
    --prod)
        # Check for production environment variables
        if [ -z "$MAINNET_RPC" ] || [ -z "$POLYGON_RPC" ] || [ -z "$ARBITRUM_RPC" ]; then
            echo "Missing RPC URLs for production deployment"
            exit 1
        fi

        # Production deployments
        # Ethereum Mainnet
        deploy_to_network "Ethereum Mainnet" \
            "$MAINNET_RPC" \
            "1" \
            "--verify --etherscan-api-key $ETHERSCAN_API_KEY"

        # Polygon Mainnet
        deploy_to_network "Polygon Mainnet" \
            "$POLYGON_RPC" \
            "137" \
            "--verify --etherscan-api-key $POLYGONSCAN_API_KEY"

        # Arbitrum One
        deploy_to_network "Arbitrum One" \
            "$ARBITRUM_RPC" \
            "42161" \
            "--verify --etherscan-api-key $ARBISCAN_API_KEY"
        ;;
    
    *)
        print_usage
        exit 1
        ;;
esac 