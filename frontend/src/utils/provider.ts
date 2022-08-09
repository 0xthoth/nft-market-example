import { StaticJsonRpcProvider } from "@ethersproject/providers";

export enum NetworkId {
  MAINNET = 1,
  TESTNET_GOERLI = 5,
}

const Environment: Record<NetworkId, string> = {
  [NetworkId.MAINNET]: "https://eth-mainnet.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
  [NetworkId.TESTNET_GOERLI]: "https://eth-goerli.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC"
}

export class Providers {
  private static _providerCache = {} as Record<NetworkId, StaticJsonRpcProvider>;

  /**
   * Returns a provider url for a given network
   */
  public static getProviderUrl(networkId: NetworkId) {
    const url = Environment[networkId]

    return url;
  }

  /**
   * Returns a static provider for a given network
   */
  public static getStaticProvider(networkId: NetworkId) {
    if (!this._providerCache[networkId])
      this._providerCache[networkId] = new StaticJsonRpcProvider(this.getProviderUrl(networkId));

    return this._providerCache[networkId];
  }
}
