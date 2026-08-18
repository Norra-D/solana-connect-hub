import { createFileRoute } from "@tanstack/react-router";

import { ClientOnly } from "@/components/ClientOnly";
import { WalletInfo } from "@/components/wallet/WalletInfo";
import { PromptPlayground } from "@/components/ai/PromptPlayground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NeuroPrompt AI — Solana-Gated Prompt Playground" },
      {
        name: "description",
        content:
          "NeuroPrompt AI is a dark-mode prompt optimizer with Solana Devnet wallet actions: tip the developer and mint prompts as proof-of-creation.",
      },
      { property: "og:title", content: "NeuroPrompt AI — Solana-Gated Prompt Playground" },
      {
        property: "og:description",
        content:
          "Optimize prompts, stream results, and settle micro-actions on Solana Devnet with your connected wallet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 max-w-3xl rounded-full bg-primary/20 blur-3xl" />

      <div className="relative mx-auto max-w-3xl space-y-10">
        <header className="space-y-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Solana Devnet
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            NeuroPrompt AI
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            A prompt playground and prototyping surface that turns rough ideas into
            structured, model-ready instructions — with wallet-native micro-actions
            built in.
          </p>
          <ClientOnly>
            <div className="flex justify-center">
              <WalletInfo />
            </div>
          </ClientOnly>
        </header>

        <ClientOnly>
          <PromptPlayground />
        </ClientOnly>
      </div>
    </main>
  );
}
