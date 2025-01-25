import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
    try {
        // Get private key from environment
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
            throw new Error('No private key found in environment variables');
        }

        const signer = (await ethers.getSigners())[0];
        console.log('Deploying with address:', signer.address);

        // Safe provider URL check
        const provider = signer.provider;
        console.log('- Provider:', provider ? 'Connected' : 'Not Connected');
        if (provider) {
            const network = await provider.getNetwork();
            console.log('- Chain ID:', network.chainId);
            console.log('- Network Name:', network.name);
            console.log('- Provider Type:', provider.constructor.name);
            console.log('- Balance:', ethers.formatEther(await provider.getBalance(signer.address)));
        }

        // Contract addresses
        const SMUZZIE_NFT = '0x319f08fD7c97fe0010B1f6171Debc8DcE3738A0e';
        const SHT_TOKEN = '0x9AF004570f2a301D99F2cE4554E564951eE48e3c';
        const TOTAL_REWARDS = ethers.parseEther('1000'); // 1000 SHT tokens
        const DISTRIBUTION_DAYS = 3n;

        console.log('\nChecking contracts:');
        console.log('- Verifying NFT contract:', SMUZZIE_NFT);
        const nftCode = await provider.getCode(SMUZZIE_NFT);
        console.log('  NFT contract exists:', nftCode !== '0x');

        console.log('- Verifying SHT contract:', SHT_TOKEN);
        const tokenCode = await provider.getCode(SHT_TOKEN);
        console.log('  Token contract exists:', tokenCode !== '0x');

        // Get SHT token contract
        console.log('\nConnecting to SHT token...');
        const shtToken = await ethers.getContractAt('IERC20', SHT_TOKEN, signer);
        const tokenBalance = await shtToken.balanceOf(signer.address);
        console.log('- SHT Balance:', ethers.formatEther(tokenBalance));
        console.log('- Required:', ethers.formatEther(TOTAL_REWARDS));

        // Deploy Staking Contract
        console.log('\nDeploying SmuzzieStaking...');
        const SmuzzieStaking = await ethers.getContractFactory('SmuzzieStaking', signer);

        // Get deployment transaction
        const deploymentData = SmuzzieStaking.interface.encodeDeploy([
            SMUZZIE_NFT,
            SHT_TOKEN,
            TOTAL_REWARDS,
            DISTRIBUTION_DAYS,
            signer.address
        ]);

        // Create and send deployment transaction
        const tx = {
            data: deploymentData,
            gasLimit: 5000000,
            gasPrice: await provider.getFeeData().then(fee => fee.gasPrice)
        };

        console.log('Sending deployment transaction...');
        const deployTx = await signer.sendTransaction(tx);
        console.log('Deployment transaction hash:', deployTx.hash);

        console.log('Waiting for deployment confirmation...');
        const receipt = await deployTx.wait();

        if (!receipt?.contractAddress) {
            throw new Error('Contract address not found in receipt');
        }

        const stakingAddress = receipt.contractAddress;
        console.log('Contract deployed to:', stakingAddress);

        // Get contract instance
        const stakingContract = await ethers.getContractAt('SmuzzieStaking', stakingAddress, signer);

        // Approve token transfer to staking contract
        console.log('\nApproving token transfer to staking contract...');
        const approveTx = await shtToken.approve(stakingAddress, TOTAL_REWARDS);
        console.log('Approval transaction sent. Waiting for confirmation...');
        await approveTx.wait();

        console.log('\nDeployment successful!');
        console.log('\nContract Parameters:');
        console.log('- NFT Contract:', SMUZZIE_NFT);
        console.log('- Token Contract:', SHT_TOKEN);
        console.log('- Total Rewards:', ethers.formatEther(TOTAL_REWARDS), 'SHT');
        console.log('- Distribution Days:', DISTRIBUTION_DAYS.toString());
        console.log('- Owner:', signer.address);
        console.log('- Staking Contract:', stakingAddress);

    } catch (err: any) {
        console.error('\nDetailed error information:');
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