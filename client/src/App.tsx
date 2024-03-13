import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OAuthClickUp from './pages/OAuthPage';
import Layout from './components/Layout';
import Automations from './pages/AutomationsPage';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './models/socket';
import { access } from 'fs';
import Workspace from './pages/WorkspacePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from 'react-bootstrap';
import BasicAuth from './pages/BasicPage';
import TokenAuth from './pages/TokenPage';
import Home from './pages/HomePage';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:3002'
);

const App: React.FC<{}> = () => {
  // client-side
  socket.on('connect', () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

  const [JWT, setJWT] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [workspaceId, setWorkspaceId] = useState<string>('');
  const [spaceIds, setSpaceIds] = useState<string[]>([]);
  const [folderIds, setFolderIds] = useState<string[]>([]);
  const [listIds, setListIds] = useState<string[]>([]);
  const [folderlessListIds, setFolderlessListIds] = useState<string[]>([]);

  const getTeamIdFromObject = (data: any) => {
    if (data !== undefined) {
      setWorkspaceId(data.id);
    }
  };

  // useEffect(() => {
  //   console.log(`from app.tsx jwt is: ${JWT}`);
  // }, [JWT]);

  return (
    <ThemeProvider
      breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
      minBreakpoint="xxs"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout JWT={JWT} />}>
            <Route index element={<Home />}></Route>
            <Route
              path="token"
              element={<TokenAuth JWTCallback={setJWT} />}
            ></Route>
            <Route
              path="basic"
              element={<BasicAuth JWTCallback={setJWT} />}
            ></Route>
            <Route
              path="oauth"
              element={<OAuthClickUp JWTCallback={setJWT} />}
            ></Route>
            <Route
              path="oauth/success"
              element={<OAuthClickUp JWTCallback={setJWT} />}
            ></Route>
            <Route
              path="workspace/:token"
              element={
                <Workspace
                  teamCallback={getTeamIdFromObject}
                  spaceCallback={setSpaceIds}
                  folderCallback={setFolderIds}
                  listCallback={setListIds}
                  folderlessListCallback={setFolderlessListIds}
                  tokenCallback={setToken}
                  JWTCallback={setJWT}
                />
              }
            ></Route>
            <Route
              path="automations"
              element={
                <Automations
                  teamId={workspaceId}
                  spaceIds={spaceIds}
                  folderIds={folderIds}
                  listIds={listIds}
                  folderlessListIds={folderlessListIds}
                  token={token}
                />
              }
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
