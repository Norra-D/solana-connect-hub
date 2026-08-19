import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/ClientOnly";

const RECIPIENT_ADDRESS = "DN5WsfVrNUZxjAxLuoFtGAhFByRiAPLWCdUS3EzDt1EP";

function safeRecipient(): PublicKey | null {
  try {
    return new PublicKey(RECIPIENT_ADDRESS);
  } catch {
    return null;
  }
}

interface TipButtonProps {
  amount?: number;
  label?: string;
  className?: string;
}

function DisconnectedTip({
  amount,
  className,
}: {
  amount: number;
  className?: string | undefined;
}) {
  const { setVisible } = useWalletModal();
  return (
    <Button onClick={() => setVisible(true)} variant="secondary" className={className}>
      Connect Wallet to Tip {amount} SOL
    </Button>
  );
}

function TipButtonInner({
  amount = 0.01,
  label = "Tip Developer",
  className,
}: TipButtonProps) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [sending, setSending] = useState(false);

  if (!publicKey) {
    return <DisconnectedTip amount={amount} className={className} />;
  }

  async function handleTip() {
    if (!publicKey || !sendTransaction) {
      toast.error("Wallet not ready");
      return;
    }

    const recipient = safeRecipient();
    if (!recipient) {
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

export function TipButton(props: TipButtonProps) {
  const amount = props.amount ?? 0.01;
  return (
    <ClientOnly
      fallback={
        <Button disabled variant="secondary" className={props.className}>
          Connect Wallet to Tip {amount} SOL
        </Button>
      }
    >
      <TipButtonInner {...props} />
    </ClientOnly>
  );
}
