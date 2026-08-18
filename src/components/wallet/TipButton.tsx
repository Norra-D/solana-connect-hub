import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

// TODO: Replace this with your actual Solana Devnet wallet address.
const RECIPIENT_ADDRESS = "YOUR_SOLANA_DEVNET_WALLET_ADDRESS";

export function TipButton() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [sending, setSending] = useState(false);

  if (!publicKey) {
    return null;
  }

  async function handleTip() {
    if (!publicKey || !sendTransaction) {
      toast.error("Wallet not ready");
      return;
    }

    if (RECIPIENT_ADDRESS === "YOUR_SOLANA_DEVNET_WALLET_ADDRESS") {
      toast.error("Please set a recipient address in TipButton.tsx");
      return;
    }

    let recipient: PublicKey;
    try {
      recipient = new PublicKey(RECIPIENT_ADDRESS);
    } catch {
      toast.error("Invalid recipient address");
      return;
    }

    try {
      setSending(true);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: 0.05 * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      toast.success("Tip sent!", {
        description: `Transaction signature: ${signature.slice(0, 16)}...`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Transaction failed";
      toast.error(message);
    } finally {
      setSending(false);
    }
  }

  return (
    <Button onClick={handleTip} disabled={sending} className="w-full sm:w-auto">
      {sending ? "Sending..." : "Tip 0.05 SOL"}
    </Button>
  );
}
