import { type HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@vechain/sdk-hardhat-plugin';
import { type HttpNetworkConfig } from 'hardhat/types';
import * as dotenv from 'dotenv';

dotenv.config();

// Verify that private key is loaded
const privateKey = process.env.PRIVATE_KEY;
console.log('Loaded private key:', privateKey ? 'Yes' : 'No');

/**
 * Main hardhat configuration
 *
 * Here we have custom VeChain networks: 'vechain_mainnet', 'vechain_testnet' and 'vechain_solo'
 *
 * They have custom parameters:
 * - debug: whether to enable debug mode
 * - delegator: the delegator to use
 * - enableDelegation: whether to enable fee delegation
 */
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.20', // Specify the first Solidity version
        settings: {
          // Additional compiler settings for this version
          optimizer: {
            enabled: true,
            runs: 200
          },
          evmVersion: 'paris'
        }
      }
    ]
  },
  networks: {
    /**
     * Mainnet configuration
     */
    vechain_mainnet: {
      url: 'https://mainnet.vechain.org',
      accounts: privateKey ? [privateKey] : [],
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1,
      timeout: 20000,
      httpHeaders: {},
      ignition: {}
    } satisfies HttpNetworkConfig,

    /**
     * Testnet configuration
     */
    vechain_testnet: {
      // Testnet
      url: 'https://testnet.vechain.org',
      accounts: [
        '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
      ],
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1,
      timeout: 20000,
      httpHeaders: {},
      ignition: {}
    } satisfies HttpNetworkConfig,

    /**
     * Testnet configuration - with delegator url
     */
    vechain_testnet_delegator_url: {
      // Testnet
      url: 'https://testnet.vechain.org',
      accounts: [
        '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
      ],
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1,
      timeout: 20000,
      httpHeaders: {},
      ignition: {}
    } satisfies HttpNetworkConfig,

    /**
     * Testnet configuration - with delegator private key
     */
    vechain_testnet_delegator_private_key: {
      // Testnet
      url: 'https://testnet.vechain.org',
      accounts: [
        '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
      ],
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1,
      timeout: 20000,
      httpHeaders: {},
      ignition: {}
    } satisfies HttpNetworkConfig,

    /**
     * Thor solo network configuration
     */
    vechain_solo: {
      // Thor solo network
      url: 'http://localhost:8669',
      accounts: [
        '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
      ],
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1,
      timeout: 20000,
      httpHeaders: {},
      ignition: {}
    } satisfies HttpNetworkConfig
  }
};

export default config;