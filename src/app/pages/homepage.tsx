'use client'; // This is a client component
import { type ReactElement } from 'react';
import { WalletButton, useWallet } from '@vechain/dapp-kit-react';
import Link from 'next/link';

const HomePage = (): ReactElement => {
    const { account } = useWallet();

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">SHTake a Smuzzie</h1>
                <WalletButton />
            </div>

            {account ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Link href="/factory">
                        <div className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer">
                            <h2 className="text-xl font-bold mb-2">Launch Contracts</h2>
                            <p className="text-gray-400">Create new tokens, NFTs, and staking contracts</p>
                        </div>
                    </Link>

                    <Link href="/mint">
                        <div className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer">
                            <h2 className="text-xl font-bold mb-2">Mint</h2>
                            <p className="text-gray-400">Mint tokens and NFTs to any address</p>
                        </div>
                    </Link>

                    <Link href="/staking">
                        <div className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer">
                            <h2 className="text-xl font-bold mb-2">Staking</h2>
                            <p className="text-gray-400">Stake your Smuzzies and earn rewards</p>
                        </div>
                    </Link>
                </div>
            ) : (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                    <p className="text-gray-400">Connect your wallet to access all features</p>
                </div>
            )}
        </div>
    );
};

// eslint-disable-next-line import/no-default-export
export default HomePage;
