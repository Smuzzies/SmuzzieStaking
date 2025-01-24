'use client'

import { useConnex, useWallet } from '@vechain/dapp-kit-react'
import { useEffect, useState } from 'react'

const ERC721_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const SMUZZIE_CONTRACT = '0x319f08fD7c97fe0010B1f6171Debc8DcE3738A0e'

export function useNFTData() {
  const { account } = useWallet()
  const connex = useConnex()
  const [nftBalance, setNftBalance] = useState(0)
  const [ownedTokenIds, setOwnedTokenIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNFTData = async () => {
      if (!account || !connex) {
        setIsLoading(false)
        return
      }

      try {
        // Get balance
        const balanceMethod = connex.thor
          .account(SMUZZIE_CONTRACT)
          .method(ERC721_ABI[0])

        const balanceResult = await balanceMethod.call(account)
        console.log('Balance result:', balanceResult) // Debug log
        const balance = parseInt(balanceResult.decoded[0])
        setNftBalance(balance)

        // Get token IDs
        const tokenIds = []
        const tokenMethod = connex.thor
          .account(SMUZZIE_CONTRACT)
          .method(ERC721_ABI[1])

        for (let i = 0; i < balance; i++) {
          const tokenResult = await tokenMethod.call(account, i)
          console.log('Token result:', tokenResult) // Debug log
          tokenIds.push(parseInt(tokenResult.decoded[0]))
        }
        
        setOwnedTokenIds(tokenIds)
      } catch (error) {
        console.error('Error fetching NFT data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNFTData()
  }, [account, connex])

  return { nftBalance, ownedTokenIds, isLoading }
} 