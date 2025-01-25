'use client'

import { useState } from 'react'
import { NFTModal } from './NFTModal'
import { useStaking } from '../hooks/useStaking'

interface NFTMetadata {
  name: string;
  image: string;
  transparent_image?: string;
  edition: number;
  rank?: number;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

interface NFTGridProps {
  ownedTokenIds: number[];
  nftMetadata: NFTMetadata[];
  isLoading: boolean;
}

export function NFTGrid({ ownedTokenIds, nftMetadata, isLoading }: NFTGridProps) {
  const [selectedNFT, setSelectedNFT] = useState<NFTMetadata | null>(null);
  const { stakedTokens, stakeToken, unstakeToken, isLoading: stakingLoading } = useStaking();

  const handleStakeClick = async (tokenId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    try {
      await stakeToken(tokenId);
    } catch (error) {
      console.error('Error staking token:', error);
    }
  };

  const handleUnstakeClick = async (tokenId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    try {
      await unstakeToken(tokenId);
    } catch (error) {
      console.error('Error unstaking token:', error);
    }
  };

  return (
    <div className="min-h-[200px] relative">
      {isLoading || stakingLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-dark-card/50 backdrop-blur-sm rounded-xl p-8 border border-primary/20 shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="text-lg text-gray-200 font-medium">
                Loading your Smuzzies
              </div>
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <span 
                    key={i}
                    className="w-3 h-3 bg-primary rounded-full animate-[bounce_1s_ease-in-out_infinite]" 
                    style={{ 
                      animationDelay: `${i * 150}ms`,
                      opacity: 0.7,
                      transform: 'scale(0)',
                      animation: 'bounce-dot 1.4s infinite'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {nftMetadata.length > 0 ? (
            nftMetadata.map((nft, index) => {
              const tokenId = ownedTokenIds[index];
              const isStaked = stakedTokens.includes(tokenId);

              return (
                <div 
                  key={index} 
                  className="bg-dark-card rounded-lg overflow-hidden border border-dark-border hover:transform hover:-translate-y-1 transition-transform cursor-pointer group"
                  onClick={() => setSelectedNFT(nft)}
                >
                  <div className="relative">
                    <img 
                      src={nft.image}
                      alt={nft.name}
                      className={`w-full aspect-square object-cover group-hover:opacity-90 transition-opacity ${isStaked ? 'opacity-50' : ''}`}
                    />
                    {isStaked && (
                      <div className="absolute top-2 right-2 bg-primary text-black text-xs font-semibold px-2 py-1 rounded">
                        Staked
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm">Click to view</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-semibold">{nft.name}</h3>
                    {nft.rank && (
                      <div className="flex items-center gap-1 text-[10px] mb-1.5">
                        <span className="text-gray-400">Rank:</span>
                        <span className="text-primary font-semibold">#{nft.rank}</span>
                        <span className="text-gray-600">/ 4025</span>
                      </div>
                    )}
                    <button 
                      className={`w-full font-semibold text-xs py-1 px-2 rounded transition-colors ${
                        isStaked 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-primary hover:bg-primary-hover text-black'
                      }`}
                      onClick={(e) => isStaked ? handleUnstakeClick(tokenId, e) : handleStakeClick(tokenId, e)}
                    >
                      {isStaked ? 'Unstake' : 'Stake'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-400">No Smuzzies found in your wallet</div>
          )}
        </div>
      )}

      <NFTModal 
        isOpen={!!selectedNFT}
        onClose={() => setSelectedNFT(null)}
        nft={selectedNFT || { name: '', image: '' }}
      />
    </div>
  );
} 