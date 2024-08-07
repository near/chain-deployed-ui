import {
  setupWalletSelector,
  type WalletSelector,
} from "@near-wallet-selector/core";
import { setupSender } from "@near-wallet-selector/sender";
import { createContext, useEffect, useState } from "react";

export const presetBundles = {
  react: ["@chain-deployed-ui/presets/react", "react", "react-dom"],
};

export const NearContext = createContext<WalletSelector | null>(null);

export function NearDappProvider(props: any) {
  const [walletSelector, setWalletSelector] = useState<WalletSelector | null>(
    null
  );
  useEffect(() => {
    if (walletSelector === null) {
      (async () => {
        setWalletSelector(
          await setupWalletSelector({
            network: "mainnet",
            modules: [setupSender()],
          })
        );
      })();
    }
  }, [walletSelector]);

  return (
    <NearContext.Provider value={walletSelector}>
      {props.children}
    </NearContext.Provider>
  );
}
