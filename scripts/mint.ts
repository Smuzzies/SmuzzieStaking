import { ethers } from 'hardhat';

async function main(): Promise<void> {
    const [deployer] = await ethers.getSigners();
    console.log('Minting with account:', deployer.address);

    // Replace with your deployed contract address
    const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

    const gameItem = await ethers.getContractAt('GameItem', CONTRACT_ADDRESS);

    console.log('Minting NFT...');
    const tx = await gameItem.awardItem(
        deployer.address,
        'ipfs://QmExample/metadata.json' // Replace with your actual metadata URI
    );

    console.log('Waiting for transaction confirmation...');
    const receipt = await tx.wait();

    if (receipt?.logs) {
        console.log('NFT Minted Successfully!');
        console.log('Transaction Hash:', tx.hash);

        // Parse and log the Transfer event
        const transferEvent = receipt.logs.find(
            (log) => log.topics[0] === gameItem.interface.getEventTopic('Transfer')
        );

        if (transferEvent) {
            const parsedLog = gameItem.interface.parseLog(transferEvent);
            console.log('Token ID:', parsedLog?.args[2]);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 