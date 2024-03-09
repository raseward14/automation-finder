export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (event: String) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  "Getting Authorization Code": () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
