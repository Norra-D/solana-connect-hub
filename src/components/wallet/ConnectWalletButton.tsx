import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/ClientOnly";

export function ConnectWalletButton() {
  return (
    <ClientOnly
      fallback={
        <Button className="wallet-connect-button" disabled>
          Connect Wallet
        </Button>
      }
    >
      <WalletMultiButton className="wallet-connect-button">
        Connect Wallet
      </WalletMultiButton>
    </ClientOnly>
  );
}
