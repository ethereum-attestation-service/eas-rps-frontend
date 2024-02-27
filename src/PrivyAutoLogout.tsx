import { usePrivy } from "@privy-io/react-auth";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useStore } from "./useStore";

export function PrivyAutoLogout({ children }: { children: React.ReactNode }) {
  const { isDisconnected } = useAccount();
  const { logout } = usePrivy();
  const [initialLoad, setInitialLoad] = useState(true);
  const setKeyStorage = useStore((state) => state.setKeyObj);
  const setSigRequested = useStore((state) => state.setSigRequested);
  const setCachedAddress = useStore((state) => state.setCachedAddress);

  useEffect(() => {
    if (isDisconnected && !initialLoad) {
      setSigRequested(false);
      setKeyStorage({key: '', wallet: ''});
      setCachedAddress('');
      logout();
    }

    if (initialLoad) {
      setInitialLoad(false);
    }
  }, [isDisconnected]);

  return <>{children}</>;
}
