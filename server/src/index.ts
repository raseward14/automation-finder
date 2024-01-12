import express, { Request, Response } from "express";
const cors = require("cors");
import { createServer } from "http";
import { Server } from "socket.io";
import { Axios } from "axios";

const app = express();
const port = process.env.PORT || 3001;
const socketPort = process.env.SOCKET_PORT || 3002;

app.use(cors());
app.use(express.json());

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  dataReceieved: (data: APIToken) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface APIToken {
  token: string;
}

const httpServer = createServer();
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  APIToken
>(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// server-side
io.on("connection", (socket: { id: any }) => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Richard.");
});

app.post("/token", async (req: Request, res: Response): Promise<any> => {
  const query = new URLSearchParams({
    client_id: req.body.client_id,
    client_secret: req.body.client_secret,
    code: req.body.code,
  }).toString();

  const resp = await fetch(
    `https://api.clickup.com/api/v2/oauth/token?${query}`,
    { method: "POST" }
  );

  const data = await resp.text();
  console.log(data);
  res.send(data);
});

httpServer.listen(socketPort, () => {
  console.log(`Server running at http://localhost:${socketPort}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
