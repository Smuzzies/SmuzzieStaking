import { useState } from 'react';
import { useWallet } from '@vechain/dapp-kit-react';

export function TokenFactory() {
    const { account } = useWallet();
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [supply, setSupply] = useState('');
    const [loading, setLoading] = useState(false);

    const createToken = async () => {
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
            <h2 className="text-xl font-bold mb-4">Create Token</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Token Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Token Symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full p-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Initial Supply"
                    value={supply}
                    onChange={(e) => setSupply(e.target.value)}
                    className="w-full p-2 rounded"
                />
                <button
                    onClick={createToken}
                    disabled={loading}
                    className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
                >
                    {loading ? 'Creating...' : 'Create Token'}
                </button>
            </div>
        </div>
    );
} 