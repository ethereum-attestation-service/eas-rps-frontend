import axios from "axios";
import { baseURL } from "../utils/utils";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useStore } from "../useStore";

export function useAutoReveal(myAddress: string | undefined) {
  const gameCommits = useStore((state) => state.gameCommits);

  const [tick, setTick] = useState(0);

  async function getGamesPendingReveal(myAddress: string) {
    const gamesPendingReveal = await axios.post<string[]>(
      `${baseURL}/gamesPendingReveal`,
      {
        address: myAddress,
      }
    );

    let reveals: { uid: string; choice: number; salt: string }[] = [];

    for (const gameUID of gamesPendingReveal.data) {
      const thisCommit = gameCommits.find((gc) => gc.challengeUID === gameUID);
      if (thisCommit) {
        reveals.push({
          uid: gameUID,
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
