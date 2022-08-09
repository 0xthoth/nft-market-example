import { useQuery } from '@tanstack/react-query'
import { useNetwork, useAccount } from 'wagmi';
import { TEM_CONTRACT, TEM_HERO_CONTRACT } from '../constants'

export const useTokenTotalSupply = () => {
  const { chain = { id: 5 } } = useNetwork();

  return useQuery(["GetTokenTotalSupply"], async () => {
    return await TEM_CONTRACT.getEthersContract(chain.id).totalSupply()
  })
}

export const useNftTotalSupply = () => {
  const { chain = { id: 5 } } = useNetwork();

  return useQuery(["GetNftTotalSupply"], async () => {
    return await TEM_HERO_CONTRACT.getEthersContract(chain.id).totalSupply()
  })
}