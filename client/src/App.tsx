import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OAuthClickUp from './components/oauth';
import Layout from './components/Layout';
import Automations from './components/Automations/automations';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './models/socket';
import { access } from 'fs';
import Workspace from './components/workspace';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from 'react-bootstrap';
import BasicAuth from './components/basic';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:3002'
);

const App: React.FC<{}> = () => {
  // client-side
  socket.on('connect', () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

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

  return (
    <ThemeProvider
      breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
      minBreakpoint="xxs"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<Layout />}></Route>
          <Route path="/basic" element={<BasicAuth />}></Route>
          <Route path="/oauth" element={<OAuthClickUp />}></Route>
          <Route path="/oauth/success" element={<OAuthClickUp />}></Route>
          <Route
            path="/workspace/:token"
            element={
              <Workspace
                teamCallback={getTeamIdFromObject}
                spaceCallback={setSpaceIds}
                folderCallback={setFolderIds}
                listCallback={setListIds}
                folderlessListCallback={setFolderlessListIds}
                tokenCallback={setToken}
              />
            }
          ></Route>
          <Route
            path="/automations"
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
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
