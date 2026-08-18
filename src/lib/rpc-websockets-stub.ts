// Server-only stub for rpc-websockets. The wallet adapter code is gated to the
// client, so this module is never executed on the server; it only exists to
// satisfy the SSR/worker bundler's import resolution.

export class Client {
  constructor(..._args: unknown[]) {
    throw new Error("rpc-websockets Client is not available on the server");
  }
}

export class CommonClient {
  constructor(..._args: unknown[]) {
    throw new Error("rpc-websockets CommonClient is not available on the server");
  }
}

export class DefaultDataPack {
  encode(_value: object): string {
    return "";
  }
  decode(_value: string): object {
    return {};
  }
}

export class WebSocket {
  constructor(..._args: unknown[]) {
    throw new Error("rpc-websockets WebSocket is not available on the server");
  }
}
