import { BigNumber, ethers } from 'ethers';
import React from 'react';
import { useAccount } from 'wagmi';
import { useGetMarketItems, useCloseTrade, useExecuteTrade } from '../hooks/useMarket';
import { useApproveTokenToMarket } from 'hooks/useApprovetoken';
import Button from './Button';
import HeroOverview from './HeroOverview';

import { shorten } from 'utils'

const MarketItems = ({
  temApproved
}: {
  temApproved: boolean
}) => {
  const { data: items, isLoading } = useGetMarketItems();
  const { address } = useAccount()
  const closeTradeMutation = useCloseTrade();
  const executeTradeMutation = useExecuteTrade();
  const approvedTEMMutation = useApproveTokenToMarket()

  const handleCloseTrade = (nftId: number) => () => {
    closeTradeMutation.mutate(nftId)
  }

  const handleExecutedTrade = (nftId: number) => () => {
    executeTradeMutation.mutate(nftId)
  }

  const handleApproveTEM = () => {
    approvedTEMMutation.mutate();
  }

  if (isLoading) return <div>Loading...</div>

  if (!items) return null;

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {
          items?.map((data: any, i: number) => {
            return (
              <div key={i}>
                <HeroOverview key={data.index} heroIndex={data.item.map((v: BigNumber[]) => Number(v))} />
                <div>
                  Poster: {shorten(data.poster)}
                </div>
                <div>
                  Price:  {ethers.utils.formatEther(data.price)} TEM
                </div>

                {
                  address && address === data.poster && <div>
                    <Button type="button" label="Close Trade" onClick={handleCloseTrade(data.index)} />
                  </div>
                }

                <div className='mt-1'>
                  {
                    address && address !== data.poster && temApproved ?
                      <Button type="button" label="Buy NFT" onClick={handleExecutedTrade(data.index)} />
                      :
                      <Button type="button" label="Approve TEM" onClick={handleApproveTEM} />
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default MarketItems;