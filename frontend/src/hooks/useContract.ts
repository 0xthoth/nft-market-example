import { Contract, ContractInterface } from "@ethersproject/contracts";
import { useMemo } from "react";
import { useNetwork, useProvider, useSigner } from "wagmi";
import ERC20_ABI from '../abi/ERC20.json'
import TEMPLAR_HERO_ABI from '../abi/TemplarHero.json'

import { Providers, NetworkId } from '../utils/provider'
import { AddressMap } from '../constants'

export const createStaticContract = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return (address: string, networkId: NetworkId) => {
    const provider = Providers.getStaticProvider(networkId);

    return useMemo(() => new Contract(address, ABI, provider) as TContract, [address, provider]);
  };
};

const createDynamicContract = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return (addressMap: AddressMap, asSigner = false) => {
    const provider = useProvider();
    const { data: signer } = useSigner();
    const { chain = { id: 5 } } = useNetwork();

    return useMemo(() => {
      const address = addressMap[chain.id as keyof typeof addressMap];

      if (!address) return null;

      const providerOrSigner = asSigner && signer ? signer : provider;

      return new Contract(address, ABI, providerOrSigner) as TContract;
    }, [addressMap, chain.id, asSigner, signer, provider]);
  };
};

export const useStaticTemContract = createDynamicContract(ERC20_ABI);
export const useStaticTemNftContract = createDynamicContract(TEMPLAR_HERO_ABI);
