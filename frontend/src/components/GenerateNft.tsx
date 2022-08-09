import { ethers } from 'ethers';
import { useApproveToken, useApproveNftToMarket } from '../hooks/useApprovetoken';
import { useTokenBalance, useNftBalance } from '../hooks/useBalance';
import { useMintHero } from '../hooks/useMintHero';
import { useNftTotalSupply, useTokenTotalSupply } from '../hooks/useTotalSupply';
import { useApp } from 'hooks/useApp';
import HeroList from './HeroList'
import Button from './Button'

const GenerateNft = () => {
  const { data: appDetails } = useApp();
  const mintHeroMutation = useMintHero()
  const approvedTEMTokenMutation = useApproveToken()
  const approveNFTsForMarket = useApproveNftToMarket()
  const { data } = useTokenBalance();
  const { data: nftBalances } = useNftBalance()
  const { data: tokenTotalSupply } = useTokenTotalSupply()
  const { data: tokenNftSupply } = useNftTotalSupply()

  const handleSubmit = () => {
    mintHeroMutation.mutate(1)
  }

  const handleApproveSubmit = () => {
    approvedTEMTokenMutation.mutate()
  }

  const handleApproveNFTSubmit = () => {
    approveNFTsForMarket.mutate()
  }


  return (
    <div className='mt-3'>
      <div className='py-2'>TEM Balance: {data && tokenTotalSupply ? `${ethers.utils.formatEther(data)}/${ethers.utils.formatEther(tokenTotalSupply)}` : "Loading..."}</div>
      <div className='py-2'>HEROs Balance: {nftBalances && tokenNftSupply ? `${Number(nftBalances)}/${Number(tokenNftSupply)}` : "Loading..."}</div>

      {
        Number(appDetails?.temApproved) > 0 ?
          <Button onClick={handleSubmit} label={mintHeroMutation.isLoading ? "Minting..." : "Mint Hero"} disabled={mintHeroMutation.isLoading} /> :
          <Button onClick={handleApproveSubmit} label={approvedTEMTokenMutation.isLoading ? "Approving..." : "Approve TEM token!!"} disabled={approvedTEMTokenMutation.isLoading} />
      }

      {
        !appDetails?.nftApproved && <Button onClick={handleApproveNFTSubmit} label={approveNFTsForMarket.isLoading ? "Approving..." : "Approve NFT for Market!!"} disabled={approveNFTsForMarket.isLoading} />
      }

      <HeroList isApproved={Boolean(appDetails?.nftApproved)} />
    </div>
  )
}

export default GenerateNft;