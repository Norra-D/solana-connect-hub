import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solana Wallet App — Connect on Devnet" },
      {
        name: "description",
        content:
          "Connect your Solana wallet on Devnet and explore a TanStack Start application powered by @solana/wallet-adapter-react.",
      },
      { property: "og:title", content: "Solana Wallet App — Connect on Devnet" },
      {
        property: "og:description",
        content:
          "Connect your Solana wallet on Devnet and explore a TanStack Start application powered by @solana/wallet-adapter-react.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Solana on Devnet
        </h1>
        <p className="text-lg text-muted-foreground">
          Connect your wallet to get started. The app is configured for the Solana Devnet
          cluster and uses the standard wallet adapter for broad browser-extension support.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
            @solana/web3.js
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
            @solana/wallet-adapter-react
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
            Devnet
          </span>
        </div>
      </div>
    </main>
  );
}
