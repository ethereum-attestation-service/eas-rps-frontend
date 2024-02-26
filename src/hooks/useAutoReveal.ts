import axios from "axios";
import {CHOICE_UNKNOWN, baseURL, decryptWithLocalKey} from "../utils/utils";
import {useEffect, useState} from "react";
import {useStore} from "../useStore";
import { useSigner } from "../utils/wagmi-utils";
import { usePrivy } from "@privy-io/react-auth";

export function useAutoReveal(myAddress: string | undefined) {
  const gameCommits = useStore((state) => state.gameCommits);
  const keyStorage = useStore((state) => state.key);
  const setKeyStorage = useStore((state) => state.setKey);

  const [tick, setTick] = useState(0);
  const [sigRequested, setSigRequested] = useState(false);
  const signer = useSigner();
  const {user} = usePrivy();

  async function getGamesPendingReveal(myAddress: string) {
    const gamesPendingReveal = await axios.post<{ uid: string; encryptedChoice: string; }[]>(
      `${baseURL}/gamesPendingReveal`,
      {
        address: myAddress,
      }
    );

    let reveals: { uid: string; choice: number; salt: string }[] = [];

    for (const game of gamesPendingReveal.data) {
      const thisCommit = gameCommits.find((gc) => gc.challengeUID === game.uid);

      const keyInPlace = signer && keyStorage.key.length > 0 && keyStorage.wallet === await signer.getAddress();

      if (signer && user && (keyInPlace || !sigRequested) ) {
        setSigRequested(true);
        const {choice,salt} = await decryptWithLocalKey(signer, game.encryptedChoice,keyStorage, setKeyStorage);
        if ((choice || choice===0) && choice!==CHOICE_UNKNOWN && salt) {
          reveals.push({
            uid: game.uid,
            choice,
            salt,
          });
        }
        setSigRequested(false);
      } else if (thisCommit) {
        reveals.push({
          uid: game.uid,
          choice: thisCommit.choice,
          salt: thisCommit.salt,
        });
      }
    }

    if (reveals.length > 0) {
      await axios.post(`${baseURL}/revealMany`, {
        reveals,
      });
    }
  }

  useEffect(() => {
    if (myAddress) {
      getGamesPendingReveal(myAddress);
    }
    setTimeout(() => {
      setTick(tick + 1);
    }, 5000);
  }, [myAddress, tick]);
}
