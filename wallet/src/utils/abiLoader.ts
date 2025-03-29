import fs from 'fs';
import path from 'path';

/**
 * Loads contract ABIs from JSON files
 * @returns Object containing the loaded ABIs
 */
export function loadContractABIs(): { TOAD: any; Governor: any } {
    const abiDir = path.join(__dirname, '../../ABI');

    const toadJson = JSON.parse(fs.readFileSync(path.join(abiDir, 'TOAD.json'), 'utf8'));
    const governorJson = JSON.parse(fs.readFileSync(path.join(abiDir, 'Governor.json'), 'utf8'));

    return {
        TOAD: toadJson.abi,
        Governor: governorJson.abi
    };
} 