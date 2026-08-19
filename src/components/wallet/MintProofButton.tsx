import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
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

interface MintProofButtonProps {
  prompt: string;
  className?: string | undefined;
}

function mockSignature() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  let out = "";
  for (let i = 0; i < 32; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function DisabledMint({ className }: { className?: string | undefined }) {
  return (
    <Button disabled variant="secondary" className={className}>
      Connect Wallet to Mint Proof-of-Creation
    </Button>
  );
}

function MintProofButtonInner({ prompt, className }: MintProofButtonProps) {
  const { publicKey } = useWallet();
  const [minting, setMinting] = useState(false);

  if (!publicKey) {
    return <DisabledMint className={className} />;
  }

  async function handleMint() {
    if (!prompt.trim()) {
      toast.error("Write a prompt before minting");
      return;
    }
    if (!safeRecipient()) {
      toast.error("Invalid program address");
      return;
    }

    setMinting(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setMinting(false);

    toast.success("Proof-of-Creation minted (mock)", {
      description: `Mock mint ${mockSignature().slice(0, 16)}... on Devnet`,
    });
  }

  return (
    <Button
      variant="outline"
      onClick={handleMint}
      disabled={minting}
      className={className}
    >
      {minting ? "Minting..." : "Mint Prompt as Proof-of-Creation"}
    </Button>
  );
}

export function MintProofButton(props: MintProofButtonProps) {
  return (
    <ClientOnly fallback={<DisabledMint className={props.className} />}>
      <MintProofButtonInner {...props} />
    </ClientOnly>
  );
}
