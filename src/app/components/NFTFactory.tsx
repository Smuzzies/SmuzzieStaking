import { useState } from 'react';
import { useWallet } from '@vechain/dapp-kit-react';

export function NFTFactory() {
    const { account } = useWallet();
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [baseURI, setBaseURI] = useState('');
    const [loading, setLoading] = useState(false);

    const createNFT = async () => {
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
        <div className="p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Create NFT Collection</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="NFT Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="NFT Symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Base URI"
                    value={baseURI}
                    onChange={(e) => setBaseURI(e.target.value)}
                    className="w-full p-2 rounded"
                />
                <button
                    onClick={createNFT}
                    disabled={loading}
                    className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
                >
                    {loading ? 'Creating...' : 'Create NFT Collection'}
                </button>
            </div>
        </div>
    );
} 