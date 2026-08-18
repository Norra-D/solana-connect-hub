import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface MintProofButtonProps {
  prompt: string;
  className?: string;
}

function mockSignature() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  let out = "";
  for (let i = 0; i < 32; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function MintProofButton({ prompt, className }: MintProofButtonProps) {
  const { publicKey } = useWallet();
  const [minting, setMinting] = useState(false);

  if (!publicKey) {
    return null;
  }

  async function handleMint() {
    if (!prompt.trim()) {
      toast.error("Write a prompt before minting");
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
