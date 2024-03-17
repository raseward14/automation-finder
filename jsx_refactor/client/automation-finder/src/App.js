import logo from './logo.svg';
import './App.css';
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import HOME from './components/home'
import OAUTH from './components/oauth'
import WORKSPACE from './components/workspace'
import AUTOMATIONS from './components/automations'
import Container from 'react-bootstrap/Container'

const socket = io.connect("http://localhost:8080/");

export default function App() {

const [token, setToken] = useState([]);
const [workspaceId, setWorkspaceId] = useState([]);
const [spaceIds, setSpaceIds] = useState([]);
const [folderIds, setFolderIds] = useState([]);
const [listIds, setListIds] = useState([]);
const [folderlessListIds, setFolderlessListIds] = useState([]);

const getTeamIdFromObject = (data) => {
  if (data !== undefined) {
    console.log('team id from app.js: ', data.id);
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
            <Route exact path="/" element={<HOME socket={socket} />}></Route>
            <Route exact path="/oauth" element={<OAUTH socket={socket} />}></Route>
            <Route exact path="/oauth/success" element={<OAUTH socket={socket} />}></Route>
            <Route exact path="/workspace/:token" element={<WORKSPACE 
                  socket={socket}
                  teamCallback={()=>getTeamIdFromObject}
                  spaceCallback={()=>setSpaceIds}
                  folderCallback={()=>setFolderIds}
                  listCallback={()=>setListIds}
                  folderlessListCallback={()=>setFolderlessListIds}
                  tokenCallback={()=>setToken}/>}></Route>
            <Route path="automations" element={<AUTOMATIONS
                  
                  socket={socket}
                  workspaceId={workspaceId}
                  spaceIds={spaceIds}
                  folderIds={folderIds}
                  folderlessListIds={folderlessListIds}
                  listIds={listIds}
                  
                />}></Route>
          </Routes>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}
