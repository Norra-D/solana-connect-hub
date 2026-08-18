import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

function shortenPublicKey(key: string | undefined) {
  if (!key) return "";
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

export function WalletInfo() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    connection
      .getBalance(publicKey)
      .then((lamports) => {
        if (!cancelled) {
          setBalance(lamports / LAMPORTS_PER_SOL);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [publicKey, connection]);

  if (!publicKey) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-border bg-secondary px-4 py-2 text-sm text-secondary-foreground sm:flex-row sm:gap-4">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Wallet</span>
        <span className="font-mono font-medium">{shortenPublicKey(publicKey.toBase58())}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Balance</span>
        <span className="font-medium">
          {loading || balance === null ? "—" : `${balance.toFixed(4)} SOL`}
        </span>
      </div>
    </div>
  );
}
