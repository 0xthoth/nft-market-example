import { useMutation, useQuery } from "react-query";
import { BigNumber, ContractReceipt, ethers } from "ethers";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { MARKET_CONTRACT, TEM_HERO_CONTRACT } from "../constants";

import templarHeroAbi from 'abi/TemplarHero.json'
import multicallv2 from 'utils/multicall'



type OpenTradeProps = {
  nftId: BigNumber,
  amount: number
}
export const useOpenTrade = () => {
  const { address = "" } = useAccount();
  const { chain = { id: 5 } } = useNetwork();
  const { data: signer } = useSigner();

  return useMutation<ContractReceipt, Error, OpenTradeProps>(async ({
    nftId, amount
  }) => {
    if (isNaN(Number(nftId))) throw new Error('Please enter a nft ID');
    if (!signer) throw new Error('Please connect a wallet to approve TEM token');

    const contract = MARKET_CONTRACT.getEthersContract(chain.id).connect(signer)

    if (!contract) throw new Error('Please switch to the Ethereum network to open trade');

    if (!address) throw new Error('Please refresh your page and try again');

    const transaction = await contract.openTrade(nftId, ethers.utils.parseEther(amount.toString()));
    return transaction.wait();
  }, {
    onError: error => {
      console.log('Error: ', error.message)
    },
    onSuccess: async (tx, amount) => {
      console.log('Successfully open traded nft')
    }
  })
}

export const useCloseTrade = () => {
  const { address = "" } = useAccount();
  const { chain = { id: 5 } } = useNetwork();
  const { data: signer } = useSigner();

  return useMutation<ContractReceipt, Error, number>(async (nftId) => {
    if (isNaN(Number(nftId))) throw new Error('Please enter a nft ID');
    if (!signer) throw new Error('Please connect a wallet to approve TEM token');

    const contract = MARKET_CONTRACT.getEthersContract(chain.id).connect(signer)

    if (!contract) throw new Error('Please switch to the Ethereum network to close trade');

    if (!address) throw new Error('Please refresh your page and try again');

    const transaction = await contract.cancelTrade(nftId);
    return transaction.wait();
  }, {
    onError: error => {
      console.log('Error: ', error.message)
    },
    onSuccess: async (tx, amount) => {
      console.log('Successfully close traded nft')
    }
  })
}

export const useExecuteTrade = () => {
  const { address = "" } = useAccount();
  const { chain = { id: 5 } } = useNetwork();
  const { data: signer } = useSigner();

  return useMutation<ContractReceipt, Error, number>(async (nftId) => {
    if (isNaN(Number(nftId))) throw new Error('Please enter a nft ID');
    if (!signer) throw new Error('Please connect a wallet to approve TEM token');

    const contract = MARKET_CONTRACT.getEthersContract(chain.id).connect(signer)

    if (!contract) throw new Error('Please switch to the Ethereum network to executed trade');

    if (!address) throw new Error('Please refresh your page and try again');

    const transaction = await contract.executeTrade(nftId);
    return transaction.wait();
  }, {
    onError: error => {
      console.log('Error: ', error.message)
    },
    onSuccess: async (tx, amount) => {
      console.log('Successfully executed traded nft')
    }
  })
}

export const useGetMarketItems = () => {
  const { chain = { id: 5 } } = useNetwork();

  return useQuery(["MarketItems"], async () => {
    try {
      const items = await MARKET_CONTRACT.getEthersContract(chain.id).fetchAvailableMarketItems()
      const itemCalls = items.map(({ item }: { item: BigNumber }) => {
        return {
          address: TEM_HERO_CONTRACT.getAddress(chain.id),
          name: 'getCharacterOverview',
          params: [item.toNumber()],
        }
      })

      const callResults = await multicallv2(chain.id, templarHeroAbi, itemCalls);
      return callResults.map((result: BigNumber[], i: number) => {
        return {
          ...items[i],
          item: [...result, items[i].item]
        }
      });

    } catch (error) {
      console.log(error)
    }
  })
}