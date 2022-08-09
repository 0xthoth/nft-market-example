import { useQuery } from '@tanstack/react-query'
import { BigNumber } from 'ethers';
import { useNetwork, useAccount } from 'wagmi';
import { TEM_CONTRACT, TEM_HERO_CONTRACT } from '../constants'

export const useTokenBalance = () => {
  const { chain = { id: 5 } } = useNetwork();
  const { address = "" } = useAccount();

  return useQuery(["GetTokenBalances"], async () => {
    return await TEM_CONTRACT.getEthersContract(chain.id).balanceOf(address)
  })
}

export const useNftBalance = () => {
  const { chain = { id: 5 } } = useNetwork();
  const { address = "" } = useAccount();

  return useQuery(["GetNftBalances"], async () => {
    try {
      return await TEM_HERO_CONTRACT.getEthersContract(chain.id).balanceOf(address)
    } catch (error) {
      console.log(error)
    }
  })
}

export const useGetMyNfts = () => {
  const { chain = { id: 5 } } = useNetwork();
  const { address = "" } = useAccount();

  return useQuery(["GetMyNfts"], async () => {
    try {
      const balance = await TEM_HERO_CONTRACT.getEthersContract(chain.id).balanceOf(address)
      const promises = await Promise.allSettled(
        Array.from(Array(Number(balance)).keys()).map(async (id: number) => {
          const index = await TEM_HERO_CONTRACT.getEthersContract(chain.id).tokenOfOwnerByIndex(address, id);
          const data = await TEM_HERO_CONTRACT.getEthersContract(chain.id).getCharacterOverview(Number(index));
          return [...data, index]
        }),
      );

      return promises
        .filter(({ status }) => status === "fulfilled")
        .map(promise => (promise as PromiseFulfilledResult<BigNumber[]>).value)

    } catch (error) {
      console.log(error)
    }
  })
}