import express, { Request, Response } from "express";
const cors = require("cors");
import { createServer } from "http";
import { Server } from "socket.io";
import AutomationRoutes from "./routes/AutomationRoutes";
import WorkspaceRoutes from "./routes/WorkspaceRoutes";
import BasicAuth from "./routes/BasicAuthRoutes";
import { URLSearchParams } from "url";
export const routes = express.Router();

const app = express();
const port = process.env.PORT || 3001;
const socketPort = process.env.SOCKET_PORT || 3002;

app.use(cors());
app.use(express.json());

const httpServer = createServer();
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}
// server-side
io.on("connection", (socket: { id: any }) => {
  console.log(socket.id + " is connected"); // x8WIv7-mJelg7on_ALbx
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

app.delete("/clear", async (req: Request, res: Response): Promise<any> => {
  
    const shard = req.body.shard;
    const client_id = req.body.client_id;
    const token = req.body.bearer;
  

  const resp = await fetch(
    `https://${shard}.clickup.com/auth/v1/oauthClientAuth/${client_id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  )
})

routes.use(WorkspaceRoutes);
routes.use(AutomationRoutes);
routes.use(BasicAuth);
app.use("/workspace", WorkspaceRoutes);
app.use("/automation", AutomationRoutes);
app.use("/auth", BasicAuth);

httpServer.listen(socketPort, () => {
  console.log(`Server running at http://localhost:${socketPort}`);
});

app.listen(port, () => {
  console.log(`BE Server running at http://localhost:${port}`);
});
