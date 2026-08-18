import { Link } from "@tanstack/react-router";

import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            NeuroPrompt AI
          </span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
