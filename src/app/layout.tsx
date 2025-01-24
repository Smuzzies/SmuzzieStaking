'use client'; // This is a client component

import { Poppins } from 'next/font/google';
import './globals.css';
import type { WalletConnectOptions } from '@vechain/dapp-kit';
import dynamic from 'next/dynamic';
import Script from 'next/script'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

const DAppKitProvider = dynamic(
    async () => {
        const { DAppKitProvider: _DAppKitProvider } = await import(
            '@vechain/dapp-kit-react'
        );
        return _DAppKitProvider;
    },
    {
        ssr: false,
    },
);

const walletConnectOptions: WalletConnectOptions = {
    projectId: 'a0b855ceaf109dbc8426479a4c3d38d8',
    metadata: {
        name: 'Sample VeChain dApp',
        description: 'A sample VeChain dApp',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: [
            typeof window !== 'undefined'
                ? `${window.location.origin}/images/logo/my-dapp.png`
                : '',
        ],
    },
};

// eslint-disable-next-line import/no-default-export
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}): React.ReactElement {
    return (
        <html lang="en">
            <head>
                <title>Next JS</title>
                <Script src="https://unpkg.com/@vechain/connex@2.0.14/dist/connex.min.js" />
            </head>
            <body className={poppins.className}>
                <DAppKitProvider
                    genesis="main"
                    logLevel="DEBUG"
                    nodeUrl="https://mainnet.vechain.org/"
                    usePersistence
                    walletConnectOptions={walletConnectOptions}
                >
                    {children}
                </DAppKitProvider>
            </body>
        </html>
    );
}
