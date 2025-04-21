#!/bin/bash

# Load environment variables
source .env

# Function to deploy to a network
deploy_to_network() {
    local network=$1
    local rpc_url=$2
    local etherscan_key=$3
    
    echo "Deploying to $network..."
    
    # Deploy using forge
    forge script script/Deploy.s.sol:DeployScript \
        --rpc-url $rpc_url \
        --broadcast \
        --verify \
        --etherscan-api-key $etherscan_key \
        -vvvv

    # Wait for deployment to complete
    sleep 10

    # Get the deployed contract address
    local deployed_address=$(forge script script/Deploy.s.sol:DeployScript \
        --rpc-url $rpc_url \
        --json | jq -r '.returns.toad')

    echo "TOAD deployed to $network at: $deployed_address"
    echo "----------------------------------------"
}

# Deploy to Optimism
if [ ! -z "$OPTIMISM_RPC_URL" ] && [ ! -z "$OPTIMISM_ETHERSCAN_API_KEY" ]; then
    deploy_to_network "Optimism" "$OPTIMISM_RPC_URL" "$OPTIMISM_ETHERSCAN_API_KEY"
fi

# Deploy to Arbitrum
if [ ! -z "$ARBITRUM_RPC_URL" ] && [ ! -z "$ARBITRUM_ETHERSCAN_API_KEY" ]; then
    deploy_to_network "Arbitrum" "$ARBITRUM_RPC_URL" "$ARBITRUM_ETHERSCAN_API_KEY"
fi

# Deploy to Polygon
if [ ! -z "$POLYGON_RPC_URL" ] && [ ! -z "$POLYGONSCAN_API_KEY" ]; then
    deploy_to_network "Polygon" "$POLYGON_RPC_URL" "$POLYGONSCAN_API_KEY"
fi 