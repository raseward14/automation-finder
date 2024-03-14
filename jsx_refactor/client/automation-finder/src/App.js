import logo from './logo.svg';
import './App.css';
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import HOME from './components/home'
import OAUTH from './components/oauth'
import Container from 'react-bootstrap/Container'

const socket = io.connect("http://localhost:8080/");


export default function App() {
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
          </Routes>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}
