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

const RECIPIENT_ADDRESS = "DN5WsfVrNUZxjAxLuoFtGAhFByRiAPLWCdUS3EzDt1EP";

interface TipButtonProps {
  amount?: number;
  label?: string;
  className?: string;
}

export function TipButton({
  amount = 0.01,
  label = "Tip Developer",
  className,
}: TipButtonProps) {
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
          lamports: Math.round(amount * LAMPORTS_PER_SOL),
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
    <Button onClick={handleTip} disabled={sending} className={className}>
      {sending ? "Sending..." : `${label} ${amount} SOL`}
    </Button>
  );
}
