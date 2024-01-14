import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OAuthClickUp from "./components/oauth";
import Layout from './components/Layout';
import Automations from './components/automations';
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./models/socket";
import { access } from "fs";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3002"
);

const App: React.FC<{}> = () => {
  const [accessToken, setAcccessToken] = useState();
  // client-side
  socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

  const OAuthProps = {
    accessToken: accessToken
  };

  useEffect(() => {
    console.log(`the accessToken is ${accessToken}`)
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' index element={<Layout />}></Route>
        <Route path="/oauth" element={<OAuthClickUp sendAccessToken={setAcccessToken} />}></Route>
        <Route path="/oauth/success" element={<OAuthClickUp sendAccessToken={setAcccessToken} />}></Route>
        <Route path="/automations" element={<Automations accessToken={OAuthProps} />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
