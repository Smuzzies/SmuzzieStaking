import { useState } from 'react';
import { useWallet } from '@vechain/dapp-kit-react';

export default function MintPage() {
    const { account } = useWallet();
    const [contractAddress, setContractAddress] = useState('');
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const mintTokens = async () => {
        if (!account) return;
        setLoading(true);
        try {
            // Add contract interaction here
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const mintNFT = async () => {
        if (!account) return;
        setLoading(true);
        try {
            // Add contract interaction here
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-8">Mint Tokens & NFTs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-4 bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Mint Tokens</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Token Contract Address"
                            value={contractAddress}
                            onChange={(e) => setContractAddress(e.target.value)}
                            className="w-full p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Recipient Address"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full p-2 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 rounded"
                        />
                        <button
                            onClick={mintTokens}
                            disabled={loading}
                            className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
                        >
                            {loading ? 'Minting...' : 'Mint Tokens'}
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Mint NFT</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="NFT Contract Address"
                            value={contractAddress}
                            onChange={(e) => setContractAddress(e.target.value)}
                            className="w-full p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Recipient Address"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full p-2 rounded"
                        />
                        <button
                            onClick={mintNFT}
                            disabled={loading}
                            className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
                        >
                            {loading ? 'Minting...' : 'Mint NFT'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 