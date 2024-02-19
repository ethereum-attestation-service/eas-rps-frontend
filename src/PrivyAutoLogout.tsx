import { usePrivy } from "@privy-io/react-auth";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export function PrivyAutoLogout({ children }: { children: React.ReactNode }) {
  const { isDisconnected } = useAccount();
  const { logout } = usePrivy();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (isDisconnected && !initialLoad) {
      logout();
    }

    if (initialLoad) {
      setInitialLoad(false);
    }
  }, [isDisconnected]);

  return <>{children}</>;
}
