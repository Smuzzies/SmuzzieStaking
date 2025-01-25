import { ethers } from 'hardhat';

async function main(): Promise<void> {
    const [deployer] = await ethers.getSigners();
    console.log('Transferring with account:', deployer.address);

    // Replace with your deployed contract address
    const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

    const gameToken = await ethers.getContractAt('GameToken', CONTRACT_ADDRESS);

    // Transfer 1000 tokens to a recipient
    const recipient = '0x9e7911de289c3c856ce7f421034f66b6cde49c39'; // Replace with actual recipient
    const amount = ethers.parseEther('1000');

    console.log('Transferring tokens...');
    const tx = await gameToken.transfer(recipient, amount);

    console.log('Waiting for transaction confirmation...');
    const receipt = await tx.wait();

    if (receipt?.status === 1) {
        console.log('Transfer Successful!');
        console.log('Transaction Hash:', tx.hash);

        // Get updated balances
        const recipientBalance = await gameToken.balanceOf(recipient);
        const deployerBalance = await gameToken.balanceOf(deployer.address);

        console.log('Recipient Balance:', ethers.formatEther(recipientBalance));
        console.log('Deployer Balance:', ethers.formatEther(deployerBalance));
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 