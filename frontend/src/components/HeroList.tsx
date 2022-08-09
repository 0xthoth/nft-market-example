
import { BigNumber } from 'ethers';
import { useGetMyNfts } from '../hooks/useBalance';
import { useOpenTrade } from '../hooks/useMarket';

import HeroOverview from './HeroOverview';
import TradeForm from './TradeForm';

const GenerateNft = ({
  isApproved = false
}: {
  isApproved: boolean
}) => {
  const { data: overviews } = useGetMyNfts()
  const openTradeMutation = useOpenTrade()

  const handleOpenTrade = (nftId: BigNumber) => (amount: number) => {
    openTradeMutation.mutate({ nftId, amount })
  }

  if (!overviews) return <div>Loading .....</div>

  return (
    <div className='mt-3'>
      <div className="grid grid-cols-4 gap-4">
        {
          overviews?.map((hero, i) => {
            return (
              <div>
                <HeroOverview key={i} heroIndex={hero.map(v => Number(v))} />
                {isApproved ? <TradeForm onSubmitForm={handleOpenTrade(hero[7])} id={+hero[7]} /> : <div>Please approve NFT for Market!</div>}

              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default GenerateNft;