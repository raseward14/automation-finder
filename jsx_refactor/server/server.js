const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http"); // Require the http module
const socketIo = require("socket.io"); // Require the socket.io module

dotenv.config();

const app = express();
const socket_port = process.env.SOCKET_PORT || 8080;
const react_port = process.env.REACT_PORT || 3000;

app.use(cors());
app.use(express.json());

const WorkspaceRouter = require("./routes/workspace_routes");
const AuthRouter = require("./routes/auth_routes");
const AutomationRouter = require("./routes/auto_routes");


app.use("/workspace", WorkspaceRouter);
app.use("/auth", AuthRouter);
app.use("/automation", AutomationRouter);


const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server, {
  cors: {
    origin: [`http://localhost:${react_port}`],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
}); // Initialize Socket.IO with the server

var jwt = "";
// Socket.IO setup
io.on("connection", (socket) => {
  console.log("Socket.io: React app connected.");

  socket.on("message", function (data) {
    console.log(data.message);
  });

  socket.on("disconnect", (data) => {
    console.log("user disconnected");
  });
});

app.use(
  cors({
    origin: [`http://localhost:${socket_port}`],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

server.listen(socket_port, () => {
  console.log(`Server is listening on port: ${socket_port}`);
  console.log(`React app is running on port: ${react_port}`)
});

