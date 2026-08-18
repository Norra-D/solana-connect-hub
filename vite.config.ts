// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { fileURLToPath } from "node:url";
import { type Plugin } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const stubPath = fileURLToPath(
  new URL("src/lib/rpc-websockets-stub.ts", import.meta.url)
);

const ssrRpcWebsocketsStub = () =>
  ({
    name: "ssr-rpc-websockets-stub",
    enforce: "pre",
    resolveId(
      id: string,
      _importer: string | undefined,
      options: { ssr?: boolean }
    ): string | undefined {
      // rpc-websockets only ships "browser" and "node" export conditions; the
      // workerd SSR build falls through and fails to resolve. The wallet adapter
      // code is gated to the client, so this stub is never executed on the server.
      if (id === "rpc-websockets" && options?.ssr) {
        return stubPath;
      }
      return undefined;
    },
  }) satisfies Plugin;

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [ssrRpcWebsocketsStub()],
  },
});
