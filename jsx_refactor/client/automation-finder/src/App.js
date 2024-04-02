import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import Layout from './components/Layout';
import BASIC from './pages/basic';
import HOME from './pages/home';
import OAUTH from './pages/oauth';
import WORKSPACE from './pages/workspace';
import AUTOMATIONS from './pages/automations';
import Container from 'react-bootstrap/Container';

const socket = io.connect("http://localhost:8080/");

export default function App() {

  const [token, setToken] = useState([]);
  const [workspaceId, setWorkspaceId] = useState([]);
  const [spaceIds, setSpaceIds] = useState([]);
  const [folderIds, setFolderIds] = useState([]);
  const [listIds, setListIds] = useState([]);
  const [folderlessListIds, setFolderlessListIds] = useState([]);

  const getTeamIdFromObject = (data) => {
    console.log('app.js team_id is:', data.id)
    if (data !== undefined) {
      setWorkspaceId(data.id);
    }
  };

  const style = {
    container: {},
  };

  return (
    <ThemeProvider
      breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
      minBreakpoint="xxs"
    >
      <Container style={style.container}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>

              <Route index element={<HOME socket={socket} />}></Route>
              <Route exact path="/basic" element={<BASIC socket={socket} />}></Route>

              <Route exact path="/oauth" element={<OAUTH socket={socket} />}></Route>
              <Route exact path="/oauth/success" element={<OAUTH socket={socket} />}></Route>
              <Route exact path="/workspace/:token" element={<WORKSPACE
                socket={socket}
                teamCallback={setWorkspaceId}
                spaceCallback={() => setSpaceIds}
                folderCallback={() => setFolderIds}
                listCallback={() => setListIds}
                folderlessListCallback={() => setFolderlessListIds}
                tokenCallback={() => setToken} />}></Route>
              <Route path="/automations" element={<AUTOMATIONS
                socket={socket}
                workspaceId={workspaceId}
              />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}
