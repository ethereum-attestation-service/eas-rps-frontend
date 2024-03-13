import {usePrivy} from "@privy-io/react-auth";
import {useEffect, useState} from "react";
import {useAccount} from "wagmi";
import {useStore} from "./useStore";

export function usePrivyAutoLogout() {
  const {isDisconnected} = useAccount();
  const {logout, ready, user} = usePrivy();
  const [disconnectedTooLong, setDisconnectedTooLong] = useState(false);
  const setKeyStorage = useStore((state) => state.setKeyObj);
  const setSigRequested = useStore((state) => state.setSigRequested);
  const setCachedAddress = useStore((state) => state.setCachedAddress);
  const setLoggingIn = useStore((state) => state.setLoggingIn);
  const loggingIn = useStore((state) => state.loggingIn);

  useEffect(() => {
    if (user && loggingIn){
      setLoggingIn(false)
    }

    if (disconnectedTooLong && isDisconnected && ready && !loggingIn) {
      setSigRequested(false);
      setKeyStorage({key: '', wallet: ''});
      setCachedAddress('');
      setDisconnectedTooLong(false);
      logout();
    }

    if (isDisconnected && ready && !loggingIn) {
      setTimeout(() => {
        setDisconnectedTooLong(true);
      }, 5000);
    } else if (disconnectedTooLong) {
      setDisconnectedTooLong(false);
    }

  }, [isDisconnected, ready, disconnectedTooLong, loggingIn, user]);
}
