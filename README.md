# Smuzzie Staking Platform

A decentralized staking platform for Smuzzie NFTs on VeChain, allowing users to stake their NFTs and earn SHT tokens as rewards.

## Overview

This project consists of:
- Factory contracts for deploying new instances of NFT, Token, and Staking contracts
- Smart contracts for NFT staking and reward distribution
- A modern web interface for interacting with the contracts
- Integration with VeChain blockchain

## Deployed Contracts (VeChain Mainnet)

### Production Contracts
- Smuzzie NFT: `0x319f08fD7c97fe0010B1f6171Debc8DcE3738A0e`
- SHT Token: `0x9AF004570f2a301D99F2cE4554E564951eE48e3c`
- Staking Contract: `0xB04442B2b8851E4f21020b3F6F7f59aA15d8C908`

### Factory Contracts
These contracts allow you to deploy new instances for testing:
- SmuzzieNFTFactory: Deploy new NFT collections
- SmuzzieTokenFactory: Deploy new reward tokens
- SmuzzieStakingFactory: Deploy new staking contracts

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- A VeChain wallet (Sync2 or VeChain Thor Wallet)
- Basic understanding of blockchain concepts

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd SmuzzieStaking
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PRIVATE_KEY=your_private_key_here
VECHAIN_NETWORK=testnet  # Use testnet for development
```

## Contract Development

### Contract Structure
```
contracts/
├── NFT/
│   ├── SmuzzieNFT.sol         # NFT implementation
│   └── SmuzzieNFTFactory.sol  # Factory for creating NFTs
├── Token/
│   ├── SmuzzieHoldingToken.sol    # Token implementation
│   └── SmuzzieTokenFactory.sol    # Factory for creating tokens
└── Staking/
    ├── SmuzzieStaking.sol         # Staking implementation
    └── SmuzzieStakingFactory.sol  # Factory for creating staking contracts
```

### Compile Contracts
```bash
npx hardhat compile
```

### Deploy Test Contracts
We provide scripts to deploy and configure test instances:

1. Deploy all factory contracts:
```bash
npm run deploy:factories
```

2. Create test instances:
```bash
npm run create:test-contracts
```

This will:
- Create a new NFT collection
- Create a new reward token
- Create a new staking contract
- Configure all permissions and connections

### Configuration Scripts

#### Create New NFT Collection
```bash
npm run create:nft -- --name "Test NFT" --symbol "TNFT" --baseUri "https://your-api.com/nft/"
```

#### Create New Token
```bash
npm run create:token -- --name "Test Token" --symbol "TT" --supply 1000000
```

#### Create New Staking Contract
```bash
npm run create:staking -- --nft <nft-address> --token <token-address> --rewards 1000 --days 30
```

### Testing

1. Run the test suite:
```bash
npx hardhat test
```

2. Run specific test files:
```bash
npx hardhat test test/NFT.test.ts
npx hardhat test test/Staking.test.ts
```

## Contract Parameters

### NFT Contract
- `name`: Collection name
- `symbol`: Token symbol
- `baseUri`: Base URI for token metadata

### Token Contract
- `name`: Token name
- `symbol`: Token symbol
- `initialSupply`: Initial token supply

### Staking Contract
- `nftContract`: Address of the NFT contract
- `rewardToken`: Address of the reward token
- `totalRewards`: Total rewards to distribute
- `distributionDays`: Period over which rewards are distributed

## Web Interface Development

### Update Contract Addresses
After deploying new test contracts, update the addresses in `src/app/constants/contracts.ts`:

```typescript
export const SMUZZIE_NFT = 'your_nft_address'
export const SHT_TOKEN = 'your_token_address'
export const SMUZZIE_STAKING = 'your_staking_address'
```

### Running the Frontend
1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

## Testing Flow

1. **Deploy Test Contracts**
   ```bash
   npm run deploy:factories
   npm run create:test-contracts
   ```

2. **Mint Test NFTs**
   ```bash
   npm run mint:test-nfts -- --amount 5
   ```

3. **Configure Staking**
   ```bash
   npm run setup:staking -- --rewards 1000
   ```

4. **Update Frontend**
   - Copy the new contract addresses to your constants file
   - Restart the development server

## Troubleshooting

Common issues and solutions:

1. **Factory Deployment Issues**
   - Ensure correct network in `.env`
   - Verify VTHO balance
   - Check contract parameters

2. **Contract Creation Issues**
   - Verify factory contract addresses
   - Check parameter formats
   - Ensure proper permissions

3. **Testing Issues**
   - Use testnet for development
   - Reset test contracts between major changes
   - Monitor gas usage

## Security Considerations

- Use testnet for all development and testing
- Never use production private keys in test environments
- Verify all contract parameters before deployment
- Test thoroughly with small amounts first

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review deployment logs
3. Open a GitHub issue
4. Contact the development team

## License

MIT License - see LICENSE file for details
