import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
    try {
        const signer = (await ethers.getSigners())[0];
        console.log('Deploying factories with address:', signer.address);

        // Deploy NFT Factory
        console.log('\nDeploying SmuzzieNFTFactory...');
        const NFTFactory = await ethers.getContractFactory('SmuzzieNFTFactory', signer);
        const nftFactory = await NFTFactory.deploy(signer.address);
        await nftFactory.waitForDeployment();
        const nftFactoryAddress = await nftFactory.getAddress();
        console.log('SmuzzieNFTFactory deployed to:', nftFactoryAddress);

        // Deploy Token Factory
        console.log('\nDeploying SmuzzieTokenFactory...');
        const TokenFactory = await ethers.getContractFactory('SmuzzieTokenFactory', signer);
        const tokenFactory = await TokenFactory.deploy(signer.address);
        await tokenFactory.waitForDeployment();
        const tokenFactoryAddress = await tokenFactory.getAddress();
        console.log('SmuzzieTokenFactory deployed to:', tokenFactoryAddress);

        // Deploy Staking Factory
        console.log('\nDeploying SmuzzieStakingFactory...');
        const StakingFactory = await ethers.getContractFactory('SmuzzieStakingFactory', signer);
        const stakingFactory = await StakingFactory.deploy(signer.address);
        await stakingFactory.waitForDeployment();
        const stakingFactoryAddress = await stakingFactory.getAddress();
        console.log('SmuzzieStakingFactory deployed to:', stakingFactoryAddress);

        // Write addresses to a file for future use
        const fs = require('fs');
        const addresses = {
            nftFactory: nftFactoryAddress,
            tokenFactory: tokenFactoryAddress,
            stakingFactory: stakingFactoryAddress,
            deployer: signer.address
        };

        fs.writeFileSync(
            'deployed-factories.json',
            JSON.stringify(addresses, null, 2)
        );

        console.log('\nFactory addresses saved to deployed-factories.json');
        console.log('\nDeployment complete!');

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