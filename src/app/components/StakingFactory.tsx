import { useState } from 'react';
import { useWallet } from '@vechain/dapp-kit-react';

export function StakingFactory() {
    const { account } = useWallet();
    const [nftAddress, setNftAddress] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [totalRewards, setTotalRewards] = useState('');
    const [days, setDays] = useState('');
    const [loading, setLoading] = useState(false);

    const createStaking = async () => {
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
            <h2 className="text-xl font-bold mb-4">Create Staking Contract</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="NFT Contract Address"
                    value={nftAddress}
                    onChange={(e) => setNftAddress(e.target.value)}
                    className="w-full p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Token Contract Address"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    className="w-full p-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Total Rewards"
                    value={totalRewards}
                    onChange={(e) => setTotalRewards(e.target.value)}
                    className="w-full p-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Distribution Days"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="w-full p-2 rounded"
                />
                <button
                    onClick={createStaking}
                    disabled={loading}
                    className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
                >
                    {loading ? 'Creating...' : 'Create Staking'}
                </button>
            </div>
        </div>
    );
} 