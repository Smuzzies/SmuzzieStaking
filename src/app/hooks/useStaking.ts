import { useConnex, useWallet } from '@vechain/dapp-kit-react'
import { useEffect, useState, useCallback } from 'react'
import { SMUZZIE_STAKING, STAKING_ABI } from '../constants/contracts'
import { ethers } from 'ethers'

export function useStaking() {
    const { account } = useWallet()
    const connex = useConnex()
    const [stakedTokens, setStakedTokens] = useState<number[]>([])
    const [claimableRewards, setClaimableRewards] = useState<string>('0')
    const [dailyRewards, setDailyRewards] = useState<string>('0')
    const [totalStaked, setTotalStaked] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(true)

    // Fetch staking data
    const fetchStakingData = useCallback(async () => {
        if (!account || !connex) return

        try {
            // Get staked tokens
            const stakedTokensMethod = connex.thor
                .account(SMUZZIE_STAKING)
                .method(STAKING_ABI.find(x => x.name === 'getStakedTokens')!)

            const stakedResult = await stakedTokensMethod.call(account)
            setStakedTokens(stakedResult.decoded[0].map((x: string) => parseInt(x)))

            // Get claimable rewards
            const claimableMethod = connex.thor
                .account(SMUZZIE_STAKING)
                .method(STAKING_ABI.find(x => x.name === 'getClaimableRewards')!)

            const claimableResult = await claimableMethod.call(account)
            setClaimableRewards(ethers.formatEther(claimableResult.decoded[0]))

            // Get daily rewards
            const dailyRewardsMethod = connex.thor
                .account(SMUZZIE_STAKING)
                .method(STAKING_ABI.find(x => x.name === 'getDailyRewards')!)

            const dailyResult = await dailyRewardsMethod.call()
            setDailyRewards(ethers.formatEther(dailyResult.decoded[0]))

            // Get total staked
            const totalStakedMethod = connex.thor
                .account(SMUZZIE_STAKING)
                .method(STAKING_ABI.find(x => x.name === 'getTotalStaked')!)

            const totalResult = await totalStakedMethod.call()
            setTotalStaked(parseInt(totalResult.decoded[0]))

        } catch (error) {
            console.error('Error fetching staking data:', error)
        } finally {
            setIsLoading(false)
        }
    }, [account, connex])

    // Stake a single token
    const stakeToken = async (tokenId: number) => {
        if (!account || !connex) return

        const method = connex.thor
            .account(SMUZZIE_STAKING)
            .method(STAKING_ABI.find(x => x.name === 'stake')!)

        const clause = method.asClause(tokenId)
        const tx = await connex.vendor.sign('tx', [clause])
        await tx.request()
        await fetchStakingData()
    }

    // Stake multiple tokens
    const stakeMany = async (tokenIds: number[]) => {
        if (!account || !connex) return

        const method = connex.thor
            .account(SMUZZIE_STAKING)
            .method(STAKING_ABI.find(x => x.name === 'stakeMany')!)

        const clause = method.asClause(tokenIds)
        const tx = await connex.vendor.sign('tx', [clause])
        await tx.request()
        await fetchStakingData()
    }

    // Unstake a single token
    const unstakeToken = async (tokenId: number) => {
        if (!account || !connex) return

        const method = connex.thor
            .account(SMUZZIE_STAKING)
            .method(STAKING_ABI.find(x => x.name === 'unstake')!)

        const clause = method.asClause(tokenId)
        const tx = await connex.vendor.sign('tx', [clause])
        await tx.request()
        await fetchStakingData()
    }

    // Unstake multiple tokens
    const unstakeMany = async (tokenIds: number[]) => {
        if (!account || !connex) return

        const method = connex.thor
            .account(SMUZZIE_STAKING)
            .method(STAKING_ABI.find(x => x.name === 'unstakeMany')!)

        const clause = method.asClause(tokenIds)
        const tx = await connex.vendor.sign('tx', [clause])
        await tx.request()
        await fetchStakingData()
    }

    // Claim rewards
    const claimRewards = async () => {
        if (!account || !connex) return

        const method = connex.thor
            .account(SMUZZIE_STAKING)
            .method(STAKING_ABI.find(x => x.name === 'claim')!)

        const clause = method.asClause()
        const tx = await connex.vendor.sign('tx', [clause])
        await tx.request()
        await fetchStakingData()
    }

    // Fetch data on mount and when account changes
    useEffect(() => {
        fetchStakingData()
    }, [account, connex, fetchStakingData])

    return {
        stakedTokens,
        claimableRewards,
        dailyRewards,
        totalStaked,
        isLoading,
        stakeToken,
        stakeMany,
        unstakeToken,
        unstakeMany,
        claimRewards,
        refreshData: fetchStakingData
    }
} 