import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

async function main(): Promise<void> {
    try {
        // Load factory addresses
        if (!fs.existsSync('deployed-factories.json')) {
            throw new Error('Factory addresses not found. Run deploy-factories.ts first.');
        }
        const factories = JSON.parse(fs.readFileSync('deployed-factories.json', 'utf8'));

        const signer = (await ethers.getSigners())[0];
        console.log('Creating test contracts with address:', signer.address);

        // Create NFT Collection
        console.log('\nCreating test NFT collection...');
        const nftFactory = await ethers.getContractAt('SmuzzieNFTFactory', factories.nftFactory, signer);
        const nftTx = await nftFactory.createNFT(
            "Test Smuzzie NFT",
            "tSMUZ",
            "https://test-api.smuzzie.com/nft/"
        );
        const nftReceipt = await nftTx.wait();
        const nftAddress = nftReceipt?.logs[0].args.nftAddress;
        console.log('Test NFT deployed to:', nftAddress);

        // Create Token
        console.log('\nCreating test token...');
        const tokenFactory = await ethers.getContractAt('SmuzzieTokenFactory', factories.tokenFactory, signer);
        const tokenTx = await tokenFactory.createToken(
            "Test Smuzzie Token",
            "tSHT",
            ethers.parseEther("1000000") // 1 million tokens
        );
        const tokenReceipt = await tokenTx.wait();
        const tokenAddress = tokenReceipt?.logs[0].args.tokenAddress;
        console.log('Test token deployed to:', tokenAddress);

        // Create Staking Contract
        console.log('\nCreating test staking contract...');
        const stakingFactory = await ethers.getContractAt('SmuzzieStakingFactory', factories.stakingFactory, signer);
        const stakingTx = await stakingFactory.createStaking(
            nftAddress,
            tokenAddress,
            ethers.parseEther("100000"), // 100k tokens as rewards
            30n // 30 days distribution period
        );
        const stakingReceipt = await stakingTx.wait();
        const stakingAddress = stakingReceipt?.logs[0].args.stakingAddress;
        console.log('Test staking contract deployed to:', stakingAddress);

        // Get contract instances
        const token = await ethers.getContractAt('SmuzzieHoldingToken', tokenAddress, signer);
        const staking = await ethers.getContractAt('SmuzzieStaking', stakingAddress, signer);

        // Approve staking contract to spend tokens
        console.log('\nApproving token transfer to staking contract...');
        const approveTx = await token.approve(stakingAddress, ethers.parseEther("100000"));
        await approveTx.wait();
        console.log('Token transfer approved');

        // Write addresses to a file
        const addresses = {
            nft: nftAddress,
            token: tokenAddress,
            staking: stakingAddress,
            deployer: signer.address
        };

        fs.writeFileSync(
            'deployed-test-contracts.json',
            JSON.stringify(addresses, null, 2)
        );

        console.log('\nTest contract addresses saved to deployed-test-contracts.json');
        console.log('\nTest contracts created successfully!');
        console.log('\nNext steps:');
        console.log('1. Mint test NFTs: npm run mint:test-nfts -- --amount <number>');
        console.log('2. Update contract addresses in src/app/constants/contracts.ts');
        console.log('3. Start the frontend: npm run dev');

    } catch (err: any) {
        console.error('\nDeployment failed:');
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