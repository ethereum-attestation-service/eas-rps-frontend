import { type PublicClient, type WalletClient } from "@wagmi/core";
import { type HttpTransport } from "viem";
import { useEffect, useState } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import { ethers, JsonRpcProvider, JsonRpcSigner } from "ethers";
import { usePrivy } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback")
    return new ethers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new ethers.JsonRpcProvider(value?.url, network)
      )
    );
  return new ethers.JsonRpcProvider(transport.url, network);
}

export async function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new ethers.BrowserProvider(transport, network);
  return provider.getSigner(account.address);
}

export function useSigner() {
  const {user} = usePrivy()
  const { data: walletClient } = useWalletClient({

  });
  const {wallet} = usePrivyWagmi();

  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
  useEffect(() => {
    async function getSigner() {
      if (!walletClient) return;

      try {
        const tmpSigner = await walletClientToSigner(walletClient);
        setSigner(tmpSigner);
      } catch (e){
        console.log('error',e)
      }
    }
    console.log(user,walletClient)

    getSigner();
  }, [walletClient,user, wallet]);
  return signer;
}

export function useProvider() {
  const publicClient = usePublicClient();

  const [provider, setProvider] = useState<JsonRpcProvider | undefined>(
    undefined
  );
  useEffect(() => {
    async function getSigner() {
      if (!publicClient) return;

      const tmpProvider = publicClientToProvider(publicClient);

      setProvider(tmpProvider as JsonRpcProvider);
    }

    getSigner();
  }, [publicClient]);
  return provider;
}
