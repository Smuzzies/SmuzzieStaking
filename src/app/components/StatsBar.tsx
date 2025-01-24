'use client'

interface StatsBarProps {
  nftBalance: number
}

export function StatsBar({ nftBalance }: StatsBarProps) {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-hover rounded-xl border border-dark-border p-4 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-white/80 text-sm mb-1">Weekly Distribution</div>
          <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <img src="/sht.png" alt="SHT" className="w-6 h-6 rounded-full" />
            <span>200,000</span>
          </div>
        </div>

        <div>
          <div className="text-white/80 text-sm mb-1">Staked Smuzzies</div>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold text-white">0/{nftBalance}</div>
            <button 
              className="bg-[#fdc603] hover:opacity-90 text-black text-sm font-semibold py-1 px-3 rounded-lg transition-colors"
              disabled={nftBalance === 0}
            >
              Stake All
            </button>
          </div>
        </div>

        <div>
          <div className="text-white/80 text-sm mb-1">Claimable $SHT</div>
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold text-white">0.00</div>
            <button className="bg-[#fdc603] hover:opacity-90 text-black text-sm font-semibold py-1 px-3 rounded-lg transition-colors">
              Claim
            </button>
          </div>
        </div>

        <div>
          <div className="text-white/80 text-sm mb-1">Total Earned</div>
          <div className="text-2xl font-bold text-white">0.00</div>
        </div>
      </div>
    </div>
  )
} 