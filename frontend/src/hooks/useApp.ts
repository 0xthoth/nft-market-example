import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers';
import { useNetwork, useAccount, useSigner } from 'wagmi';
import { TEM_CONTRACT, TEM_HERO_CONTRACT, MARKET_CONTRACT } from '../constants'

export const useApp = () => {
  const { chain = { id: 5 } } = useNetwork();
  const { address = "" } = useAccount();
  const { data: signer } = useSigner();

  return useQuery(["appData"], async () => {

    if (!signer) throw new Error('Please connect a wallet to approve TEM token');

    const nft = TEM_HERO_CONTRACT.getEthersContract(chain.id).connect(signer)
    const tem = TEM_CONTRACT.getEthersContract(chain.id).connect(signer)

    const nftApproved = await nft.isApprovedForAll(address, MARKET_CONTRACT.getAddress(chain.id));
    const temApproved = await tem.allowance(address, TEM_HERO_CONTRACT.getAddress(chain.id));
    const temApprovedMarket = await tem.allowance(address, MARKET_CONTRACT.getAddress(chain.id));

    return {
      nftApproved,
      temApproved: ethers.utils.formatEther(temApproved),
      temApprovedMarket: ethers.utils.formatEther(temApprovedMarket),
    }
  }, {
    refetchInterval: 5000
  })
}

