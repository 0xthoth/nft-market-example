import { useMutation } from "react-query";
import { MaxUint256 } from "@ethersproject/constants";
import { ContractReceipt } from "ethers";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { TEM_CONTRACT, TEM_HERO_CONTRACT, MARKET_CONTRACT } from "../constants";


export const useApproveToken = () => {
  const { address = "" } = useAccount();
  const { chain = { id: 5 } } = useNetwork();
  const { data: signer } = useSigner();

  const spenderAddress = TEM_HERO_CONTRACT.getAddress(chain.id)

  return useMutation<ContractReceipt, Error>(async () => {

    if (!signer) throw new Error('Please connect a wallet to approve TEM token');
    if (!address) throw new Error('Please refresh your page and try again');

    const contract = TEM_CONTRACT.getEthersContract(chain.id).connect(signer)

    if (!contract) throw new Error('Please switch to the Ethereum network to approve TEM token');

    const transaction = await contract.approve(spenderAddress, MaxUint256)
    return transaction.wait();
  }, {
    onError: error => {
      console.log('Error: ', error)
    },
    onSuccess: async (tx, amount) => {
      console.log('Successfully approved TEM token')
    }
  })
}

export const useApproveTokenToMarket = () => {
  const { address = "" } = useAccount();
  const { chain = { id: 5 } } = useNetwork();
  const { data: signer } = useSigner();

  const spenderAddress = MARKET_CONTRACT.getAddress(chain.id)

  return useMutation<ContractReceipt, Error>(async () => {

    if (!signer) throw new Error('Please connect a wallet to approve TEM token');
    if (!address) throw new Error('Please refresh your page and try again');

    const contract = TEM_CONTRACT.getEthersContract(chain.id).connect(signer)

    if (!contract) throw new Error('Please switch to the Ethereum network to approve TEM token');

    const transaction = await contract.approve(spenderAddress, MaxUint256)
    return transaction.wait();
  }, {
    onError: error => {
      console.log('Error: ', error)
    },
    onSuccess: async (tx, amount) => {
      console.log('Successfully approved TEM token')
    }
  })
}

export const useApproveNftToMarket = () => {
  const { address = "" } = useAccount();
  const { chain = { id: 5 } } = useNetwork();
  const { data: signer } = useSigner();

  const spenderAddress = MARKET_CONTRACT.getAddress(chain.id)

  return useMutation<ContractReceipt, Error>(async () => {

    if (!signer) throw new Error('Please connect a wallet to approve NFTs for Market');
    if (!address) throw new Error('Please refresh your page and try again');

    const contract = TEM_HERO_CONTRACT.getEthersContract(chain.id).connect(signer)

    if (!contract) throw new Error('Please switch to the Ethereum network to approve NFT for Market');

    const transaction = await contract.setApprovalForAll(spenderAddress, true)
    return transaction.wait();
  }, {
    onError: error => {
      console.log('Error: ', error)
    },
    onSuccess: async (tx, amount) => {
      console.log('Successfully approved NFT for Market')
    }
  })
}