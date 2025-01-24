'use client'; // This is a client component

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const WalletSection = dynamic(
  () => import('./components/WalletSection').then(mod => mod.WalletSection),
  { ssr: false }
)

const NFTDataProvider = dynamic(
  () => import('./components/NFTDataProvider').then(mod => mod.NFTDataProvider),
  { ssr: false }
)

const StatsBar = dynamic(
  () => import('./components/StatsBar').then(mod => mod.StatsBar),
  { ssr: false }
)

const NFTGrid = dynamic(
  () => import('./components/NFTGrid').then(mod => mod.NFTGrid),
  { ssr: false }
)

export default function Page() {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
      const target = new Date(utcNow)
      target.setUTCHours(23, 59, 0, 0)

      if (utcNow > target) {
        target.setDate(target.getDate() + 1)
      }

      const diff = target.getTime() - utcNow.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Get current week progress
  const getDayStatus = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    
    return days.map((day, index) => ({
      day,
      isCurrent: index === today,
      // For demo: past days alternate between claimed and missed
      status: index < today 
        ? index % 2 === 0 ? 'claimed' : 'missed'
        : 'unclaimed'
    }));
  };

  const weekProgress = getDayStatus();
  const claimedDays = weekProgress.filter(day => day.status === 'claimed').length;

  // Add a check for timeLeft and provide a default value
  const timeParts = timeLeft?.split(':') || ['00', '00', '00'];

  return (
    <div className="min-h-screen bg-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex flex-col mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold">
              SHTake a <span className="text-primary">Smuzzie</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Earn $SHT by staking your Smuzzies
            </p>
          </div>
          <WalletSection />
        </header>

        {/* Info and Timer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Staking Info */}
          <div className="bg-dark-card rounded-xl border border-dark-border p-4">
            <h2 className="text-lg font-semibold mb-2">How Staking Works:</h2>
            <ul className="text-gray-400 text-sm space-y-1 list-disc pl-4">
              <li>Each NFT can earn rewards once per day</li>
              <li>Daily rewards must be claimed within 24 hours</li>
              <li>Unclaimed rewards are redistributed to all stakers the next day</li>
              <li>The more NFTs staked, the higher your potential daily earnings</li>
            </ul>
          </div>

          {/* Timer */}
          <div className="bg-dark-card rounded-xl border border-dark-border p-4">
            <h2 className="text-lg font-semibold mb-4">Next Reward Distribution</h2>
            <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
              <div className="flex items-center gap-0.5 sm:gap-2">
                {/* Hours */}
                <div className="flex flex-col items-center">
                  <div className="flex gap-0.5 sm:gap-1">
                    <div className="relative flex flex-col items-center">
                      <div className="bg-[#fdc603] w-8 h-8 sm:w-12 sm:h-12 rounded-md flex items-center justify-center shadow-lg">
                        <span className="font-mono text-lg sm:text-2xl font-bold text-black">
                          {timeParts[0]?.charAt(0) || '0'}
                        </span>
                      </div>
                    </div>
                    <div className="relative flex flex-col items-center">
                      <div className="bg-[#fdc603] w-8 h-8 sm:w-12 sm:h-12 rounded-md flex items-center justify-center shadow-lg">
                        <span className="font-mono text-lg sm:text-2xl font-bold text-black">
                          {timeParts[0]?.charAt(1) || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-white text-[10px] sm:text-xs mt-1">HOURS</span>
                </div>

                <span className="font-mono text-lg sm:text-2xl font-bold text-white/30 self-start mt-2 sm:mt-3">|</span>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <div className="flex gap-0.5 sm:gap-1">
                    <div className="relative flex flex-col items-center">
                      <div className="bg-[#fdc603] w-8 h-8 sm:w-12 sm:h-12 rounded-md flex items-center justify-center shadow-lg">
                        <span className="font-mono text-lg sm:text-2xl font-bold text-black">
                          {timeParts[1]?.charAt(0) || '0'}
                        </span>
                      </div>
                    </div>
                    <div className="relative flex flex-col items-center">
                      <div className="bg-[#fdc603] w-8 h-8 sm:w-12 sm:h-12 rounded-md flex items-center justify-center shadow-lg">
                        <span className="font-mono text-lg sm:text-2xl font-bold text-black">
                          {timeParts[1]?.charAt(1) || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-white text-[10px] sm:text-xs mt-1">MINUTES</span>
                </div>

                <span className="font-mono text-lg sm:text-2xl font-bold text-white/30 self-start mt-2 sm:mt-3">|</span>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                  <div className="flex gap-0.5 sm:gap-1">
                    <div className="relative flex flex-col items-center">
                      <div className="bg-[#fdc603] w-8 h-8 sm:w-12 sm:h-12 rounded-md flex items-center justify-center shadow-lg">
                        <span className="font-mono text-lg sm:text-2xl font-bold text-black">
                          {timeParts[2]?.charAt(0) || '0'}
                        </span>
                      </div>
                    </div>
                    <div className="relative flex flex-col items-center">
                      <div className="bg-[#fdc603] w-8 h-8 sm:w-12 sm:h-12 rounded-md flex items-center justify-center shadow-lg">
                        <span className="font-mono text-lg sm:text-2xl font-bold text-black">
                          {timeParts[2]?.charAt(1) || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-white text-[10px] sm:text-xs mt-1">SECONDS</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-3">
                Daily reset at 23:59 UTC
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Progress Banner */}
        <div className="bg-dark-card rounded-xl border border-dark-border p-4 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Weekly Claim Progress</h2>
            <span className="text-sm text-gray-400">{claimedDays}/7 days claimed</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekProgress.map(({ day, status, isCurrent }) => (
              <div key={day} className="flex flex-col items-center p-2 rounded-lg">
                <span className={`text-sm font-medium mb-1 px-2 py-0.5 rounded ${
                  isCurrent ? 'bg-black/90' : ''
                }`}>
                  {day.slice(0, 3)}
                </span>
                {status === 'claimed' ? (
                  <div className="text-green-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs hidden sm:inline">Claimed</span>
                  </div>
                ) : status === 'missed' ? (
                  <div className="text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs hidden sm:inline">Missed</span>
                  </div>
                ) : (
                  <div className="text-gray-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs hidden sm:inline">Unclaimed</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <NFTDataProvider />
      </div>
    </div>
  )
}
