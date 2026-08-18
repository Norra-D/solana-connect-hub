import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { ClientOnly } from "@/components/ClientOnly";

export function ConnectWalletButton() {
  return (
    <ClientOnly>
      <WalletMultiButton className="wallet-connect-button" />
    </ClientOnly>
  );
}
