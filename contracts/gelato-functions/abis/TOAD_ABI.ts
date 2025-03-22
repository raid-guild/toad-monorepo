export const TOAD_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256[]",
                "name": "_tallyIds",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "_votingPeriods",
                "type": "uint256[]"
            }
        ],
        "name": "discoverProposals",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256[]",
                "name": "_tallyIds",
                "type": "uint256[]"
            },
            {
                "internalType": "uint8[]",
                "name": "_answers",
                "type": "uint8[]"
            }
        ],
        "name": "answer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getActiveProposals",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "tallyId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint8",
                        "name": "answer",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "discoveredAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "validBlock",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "disablePower",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "votingPeriod",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "announced",
                        "type": "bool"
                    }
                ],
                "internalType": "struct TOAD.ProposalView[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]; 