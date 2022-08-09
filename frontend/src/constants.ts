import { NetworkId } from './utils/provider';
import { Contract } from './utils/Contract'
import { TemplarHero__factory, TemToken__factory, Market__factory, Multicall__factory } from './typechain';

export type AddressMap = Partial<Record<NetworkId, string>>;

// Addresses
export const TEM_TOKEN_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0xCAa07F005c249e46Bda6F6FeeE30F80B9233aCd7"
}
export const TEM_NFT_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x3ac226a1a9ddcbEE9169B1B381a103BB38dDbe40"
}
export const MARKET_ADDRESS = {
  [NetworkId.TESTNET_GOERLI]: "0xdB2177E16c9e7c6A02D2a3fc4c79F1d992177Fcf"
}
export const MULTICALL_ADDRESS = {
  [NetworkId.TESTNET_GOERLI]: "0x9feDc1aA7d798D59857e2EF992660AD9Dbc082A6"
}

// Contracts
export const TEM_CONTRACT = new Contract({
  factory: TemToken__factory,
  name: "Tem Token Contract",
  addresses: TEM_TOKEN_ADDRESSES,
});


export const TEM_HERO_CONTRACT = new Contract({
  factory: TemplarHero__factory,
  name: "Tem NFT Contract",
  addresses: TEM_NFT_ADDRESSES,
});

export const MARKET_CONTRACT = new Contract({
  factory: Market__factory,
  name: "Market Contract",
  addresses: MARKET_ADDRESS,
});

export const MULTICALL_CONTRACT = new Contract({
  factory: Multicall__factory,
  name: "Multicall2 Contract",
  addresses: MULTICALL_ADDRESS,
});