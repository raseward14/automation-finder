export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  dataRecieved: (data: APIToken) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface APIToken {
  token: string;
}
