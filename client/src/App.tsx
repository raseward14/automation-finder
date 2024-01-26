import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OAuthClickUp from "./components/oauth";
import Layout from "./components/Layout";
import Automations from "./components/Automations/automations";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./models/socket";
import { access } from "fs";
import Workspace from "./components/workspace";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThemeProvider } from "react-bootstrap";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3002"
);

const App: React.FC<{}> = () => {
  // client-side
  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

  const [token, setToken] = useState<string>("");
  const [workspaceData, setWorkspaceData] = useState<string>("");

  const getTeamIdFromObject = (data: any) => {
    console.log(data[0].id);
    setWorkspaceData(data[0].id);
  };

  return (
    <ThemeProvider
      breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
      minBreakpoint="xxs">
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<Layout />}></Route>
          <Route path="/oauth" element={<OAuthClickUp />}></Route>
          <Route path="/oauth/success" element={<OAuthClickUp />}></Route>
          <Route
            path="/automations"
            element={<Automations teamId={workspaceData} />}></Route>
          <Route
            path="/workspace/:token"
            element={<Workspace teamCallback={getTeamIdFromObject} />}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
