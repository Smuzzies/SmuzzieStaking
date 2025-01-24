'use client'

import { useConnex, useWallet } from '@vechain/dapp-kit-react'
import { useEffect, useState, useCallback } from 'react'
import { StatsBar } from './StatsBar'
import { NFTGrid } from './NFTGrid'

const SMUZZIE_CONTRACT = '0x319f08fD7c97fe0010B1f6171Debc8DcE3738A0e'

interface SmuzzieMetadata {
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

// ABI definitions for all required methods
const balanceOfABI = {
  "constant": true,
  "inputs": [
    {"name": "_owner", "type": "address"}
  ],
  "name": "balanceOf",
  "outputs": [
    {"name": "balance", "type": "uint256"}
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}

const tokenOfOwnerByIndexABI = {
  "constant": true,
  "inputs": [
    {"name": "_owner", "type": "address"},
    {"name": "_index", "type": "uint256"}
  ],
  "name": "tokenOfOwnerByIndex",
  "outputs": [
    {"name": "", "type": "uint256"}
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}

const tokenURIABI = {
  "constant": true,
  "inputs": [
    {"name": "_tokenId", "type": "uint256"}
  ],
  "name": "tokenURI",
  "outputs": [
    {"name": "", "type": "string"}
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}

export function NFTDataProvider() {
  const { account } = useWallet()
  const connex = useConnex()
  const [nftBalance, setNftBalance] = useState(0)
  const [ownedTokenIds, setOwnedTokenIds] = useState<number[]>([])
  const [nftMetadata, setNftMetadata] = useState<SmuzzieMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugLog, setDebugLog] = useState<string[]>([])
  const [showDebug, setShowDebug] = useState(false)

  const addDebugLog = useCallback((message: string) => {
    setDebugLog(prev => [...prev, `${new Date().toISOString()}: ${message}`])
    console.log(message) // Also log to console
  }, [])

  const getTokenMetadata = async (tokenId: number): Promise<SmuzzieMetadata | null> => {
    try {
      addDebugLog(`Fetching metadata for token ${tokenId}`)
      
      const tokenURIMethod = connex.thor
        .account(SMUZZIE_CONTRACT)
        .method(tokenURIABI)

      const result = await tokenURIMethod.call(tokenId)
      if (!result.decoded?.[0]) {
        addDebugLog(`No URI found for token ${tokenId}`)
        return null
      }

      const uri = result.decoded[0] as string
      addDebugLog(`URI for token ${tokenId}: ${uri}`)

      // Handle Arweave URI
      if (uri.startsWith('ar://')) {
        const arweaveId = uri.replace('ar://', '')
        const arweaveUrl = `https://arweave.net/${arweaveId}`
        addDebugLog(`Fetching from Arweave: ${arweaveUrl}`)
        
        const response = await fetch(arweaveUrl)
        const metadata = await response.json()
        addDebugLog(`Metadata received for token ${tokenId}: ${JSON.stringify(metadata)}`)

        // Convert Arweave image URLs
        if (metadata.image?.startsWith('ar://')) {
          metadata.image = `https://arweave.net/${metadata.image.replace('ar://', '')}`
          addDebugLog(`Converted image URL: ${metadata.image}`)
        }
        if (metadata.transparent_image?.startsWith('ar://')) {
          metadata.transparent_image = `https://arweave.net/${metadata.transparent_image.replace('ar://', '')}`
          addDebugLog(`Converted transparent image URL: ${metadata.transparent_image}`)
        }

        return metadata
      }

      return null
    } catch (error) {
      addDebugLog(`Error fetching metadata for token ${tokenId}: ${error}`)
      return null
    }
  }

  useEffect(() => {
    const fetchNFTData = async () => {
      if (!account || !connex) {
        addDebugLog('No account or Connex instance available')
        setIsLoading(false)
        return
      }

      try {
        addDebugLog(`Starting NFT data fetch for account: ${account}`)
        addDebugLog(`Using contract: ${SMUZZIE_CONTRACT}`)

        // Create method instance
        const balanceMethod = connex.thor
          .account(SMUZZIE_CONTRACT)
          .method(balanceOfABI)

        addDebugLog('Calling balanceOf...')
        const balanceResult = await balanceMethod.call(account)
        addDebugLog(`Raw balance result: ${JSON.stringify(balanceResult)}`)
        
        if (!balanceResult.decoded || !balanceResult.decoded[0]) {
          addDebugLog('No balance data returned')
          setIsLoading(false)
          return
        }

        const balance = parseInt(balanceResult.decoded[0])
        addDebugLog(`Parsed balance: ${balance} NFTs`)
        setNftBalance(balance)

        // Get token IDs and metadata
        const tokenIds: number[] = []
        const metadata: SmuzzieMetadata[] = []
        const tokenMethod = connex.thor
          .account(SMUZZIE_CONTRACT)
          .method(tokenOfOwnerByIndexABI)

        addDebugLog(`Fetching data for ${balance} tokens...`)
        for (let i = 0; i < balance; i++) {
          try {
            addDebugLog(`Fetching token at index: ${i}`)
            const tokenResult = await tokenMethod.call(account, i)
            addDebugLog(`Raw token result for index ${i}: ${JSON.stringify(tokenResult)}`)
            
            if (tokenResult.decoded && tokenResult.decoded[0]) {
              const tokenId = parseInt(tokenResult.decoded[0])
              addDebugLog(`Found token ID: ${tokenId}`)
              tokenIds.push(tokenId)

              // Fetch metadata for this token
              const tokenMetadata = await getTokenMetadata(tokenId)
              if (tokenMetadata) {
                addDebugLog(`Successfully fetched metadata for token ${tokenId}`)
                metadata.push(tokenMetadata)
              } else {
                addDebugLog(`No metadata found for token ${tokenId}`)
              }
            }
          } catch (err) {
            addDebugLog(`Error fetching token at index ${i}: ${err}`)
            break
          }
        }
        
        addDebugLog(`Final token IDs: ${tokenIds.join(', ')}`)
        addDebugLog(`Total metadata objects fetched: ${metadata.length}`)
        setOwnedTokenIds(tokenIds)
        setNftMetadata(metadata)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        addDebugLog(`Error fetching NFT data: ${errorMessage}`)
        setError(`Failed to fetch NFT data: ${errorMessage}`)
      } finally {
        setIsLoading(false)
        addDebugLog('NFT data fetch completed')
      }
    }

    fetchNFTData()
  }, [account, connex, addDebugLog])

  const debugPanel = showDebug && (
    <div className="mt-4 p-4 bg-black/20 rounded-lg">
      <div className="text-xs font-mono text-gray-400 max-h-40 overflow-y-auto">
        {debugLog.map((log, i) => (
          <div key={i} className="py-1 border-b border-gray-800">{log}</div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <StatsBar nftBalance={nftBalance} />
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 rounded-lg border border-red-400 text-red-200">
          ⚠️ {error}
        </div>
      )}
      <NFTGrid 
        ownedTokenIds={ownedTokenIds} 
        nftMetadata={nftMetadata}
        isLoading={isLoading} 
      />
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="mt-4 px-4 py-2 text-sm text-gray-400 hover:text-gray-300"
      >
        {showDebug ? 'Hide' : 'Show'} Debug Log
      </button>
      {debugPanel}
    </>
  )
} 