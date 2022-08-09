import { useMutation } from "react-query";
import { ContractReceipt } from "ethers";
import { useAccount } from "wagmi";
import { useStaticTemNftContract } from "./useContract";
import { TEM_NFT_ADDRESSES } from "../constants";


export const useMintHero = () => {
  const { address = "" } = useAccount();
  const contract = useStaticTemNftContract(TEM_NFT_ADDRESSES, true);

  return useMutation<ContractReceipt, Error, number>(async (amount) => {
    if (!amount || isNaN(Number(amount))) throw new Error('Please enter a number');

    if (!contract) throw new Error('Please switch to the Ethereum network to mint hero');

    if (!address) throw new Error('Please refresh your page and try again');

    const transaction = await contract.requestNewRandomHero(amount)
    return transaction.wait();
  }, {
    onError: error => {
      console.log('Error: ', error)
    },
    onSuccess: async (tx, amount) => {
      console.log('Successfully minted hero')
    }
  })
}