'use client'

import { useStaking } from '../hooks/useStaking'

interface StatsBarProps {
  nftBalance: number
}

export function StatsBar({ nftBalance }: StatsBarProps) {
  const { 
    stakedTokens, 
    claimableRewards, 
    dailyRewards,
    stakeMany,
    claimRewards,
    isLoading 
  } = useStaking()

  const handleStakeAll = async () => {
    try {
      // Get all unstaked token IDs
      const unstakedTokens = Array.from({ length: nftBalance }, (_, i) => i + 1)
        .filter(id => !stakedTokens.includes(id))
      
      if (unstakedTokens.length > 0) {
        await stakeMany(unstakedTokens)
      }
    } catch (error) {
      console.error('Error staking all tokens:', error)
    }
  }

  const handleClaim = async () => {
    try {
      await claimRewards()
    } catch (error) {
      console.error('Error claiming rewards:', error)
    }
  }

  return (
    <div className="bg-gradient-to-r from-primary to-primary-hover rounded-xl border border-dark-border p-4 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {/* Weekly Distribution */}
        <div>
          <div className="text-white/80 text-sm mb-1">Daily Distribution</div>
          <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <img src="/sht.png" alt="SHT" className="w-8 h-8 rounded-full" />
            <span>{isLoading ? '...' : dailyRewards}</span>
          </div>
        </div>

        {/* Total Earned */}
        <div>
          <div className="text-white/80 text-sm mb-1">Total Earned</div>
          <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <img src="/sht.png" alt="SHT" className="w-8 h-8 rounded-full" />
            <span>{isLoading ? '...' : claimableRewards}</span>
          </div>
        </div>

        {/* Staked Smuzzies */}
        <div>
          <div className="text-white/80 text-sm mb-1">Staked Smuzzies</div>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold text-white">
              {isLoading ? '...' : `${stakedTokens.length}/${nftBalance}`}
            </div>
            <button 
              className="bg-[#fdc603] hover:opacity-90 text-black text-sm font-semibold py-1 px-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleStakeAll}
              disabled={nftBalance === 0 || stakedTokens.length === nftBalance}
            >
              Stake All
            </button>
          </div>
        </div>

        {/* Claimable $SHT */}
        <div>
          <div className="text-white/80 text-sm mb-1">Claimable $SHT</div>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold text-white">
              {isLoading ? '...' : claimableRewards}
            </div>
            <button 
              className="bg-[#fdc603] hover:opacity-90 text-black text-sm font-semibold py-1 px-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleClaim}
              disabled={parseFloat(claimableRewards) === 0}
            >
              Claim
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 