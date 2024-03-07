import {type WalletClient} from "@wagmi/core";
import {useEffect, useState} from "react";
import {useWalletClient} from "wagmi";
import {ethers, JsonRpcSigner} from "ethers";
import {usePrivyWagmi} from "@privy-io/wagmi-connector";

export async function walletClientToSigner(walletClient: WalletClient) {
  const {account, chain, transport} = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new ethers.BrowserProvider(transport, network);
  return provider.getSigner(account.address);
}

export function useSigner() {
  const {wallet} = usePrivyWagmi();
  const {data: walletClient} = useWalletClient();
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);

  useEffect(() => {
    async function getSigner() {
      if (!walletClient) return;

      try {
        const tmpSigner = await walletClientToSigner(walletClient);
        setSigner(tmpSigner);
      } catch (e) {
        console.log('error', e)
      }
    }

    getSigner();

  }, [wallet, walletClient]);
  return signer;
}
