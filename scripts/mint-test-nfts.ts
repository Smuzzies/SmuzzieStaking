import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

async function main(): Promise<void> {
    try {
        // Get amount from command line arguments
        const args = process.argv.slice(2);
        const amountIndex = args.indexOf('--amount');
        if (amountIndex === -1 || !args[amountIndex + 1]) {
            throw new Error('Please specify amount with --amount <number>');
        }
        const amount = parseInt(args[amountIndex + 1]);
        if (isNaN(amount) || amount <= 0) {
            throw new Error('Amount must be a positive number');
        }

        // Load test contract addresses
        if (!fs.existsSync('deployed-test-contracts.json')) {
            throw new Error('Test contract addresses not found. Run create-test-contracts.ts first.');
        }
        const contracts = JSON.parse(fs.readFileSync('deployed-test-contracts.json', 'utf8'));

        const signer = (await ethers.getSigners())[0];
        console.log('Minting NFTs with address:', signer.address);
        console.log('Amount to mint:', amount);

        // Get NFT contract instance
        const nft = await ethers.getContractAt('SmuzzieNFT', contracts.nft, signer);

        // Mint NFTs
        console.log('\nMinting NFTs...');
        for (let i = 0; i < amount; i++) {
            const mintTx = await nft.safeMint(signer.address);
            await mintTx.wait();
            console.log(`Minted NFT #${i + 1}`);
        }

        // Get final balance
        const balance = await nft.balanceOf(signer.address);
        console.log('\nMinting complete!');
        console.log('Your NFT balance:', balance.toString());
        console.log('\nNext steps:');
        console.log('1. Start the frontend: npm run dev');
        console.log('2. Connect your wallet and view your NFTs');
        console.log('3. Try staking some NFTs');

    } catch (err: any) {
        console.error('\nMinting failed:');
        console.error('- Error name:', err.name);
        console.error('- Error message:', err.message);
        if (err.data) console.error('- Error data:', err.data);
        if (err.transaction) console.error('- Transaction:', err.transaction);
        if (err.receipt) console.error('- Receipt:', err.receipt);
        throw err;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 