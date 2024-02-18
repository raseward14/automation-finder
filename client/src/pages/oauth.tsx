import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { APIConstants } from '../constants'; //object of secret values: export const APIConstants = { key: value} hidden by gitignore
import { Button, Form, Row } from 'react-bootstrap';
import { ClientToServerEvents, ServerToClientEvents } from '../models/socket';
import { Socket, io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Workspace from './workspace';
import { Container } from 'react-bootstrap';
// import BasicAuth from "./basic";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:3002'
);

export default function OAuthClickUp() {
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [gotCode, setGotCode] = useState<boolean>(false);
  const [gotToken, setGotToken] = useState<boolean>(false);

  useEffect(() => {
    if (window.location.pathname === '/oauth/success' && gotCode === false) {
      SetAuthorizationCode();
    }
  }, []);

  useEffect(() => {
    if (gotCode === true && gotToken === false) {
      GetAccessToken();
    }
  });

  const GetAuthorizationCode = (
    client_id: string,
    redirect_uri: string
  ): string => {
    let url = `https://app.clickup.com/api?client_id=${client_id}&redirect_uri=${redirect_uri}`;

    return url;
  };

  const SetAuthorizationCode = (): void => {
    let url = window.location.search;
    setAccessCode(url.replace('?code=', ''));
    setGotCode(true);
  };

  const GetAccessToken = async (): Promise<void> => {
    await axios
      .post(`http://localhost:3001/token`, {
        client_id: APIConstants.client_id,
        client_secret: APIConstants.client_secret,
        code: accessCode,
      })
      .then((resp) => {
        setAccessToken(
          JSON.stringify(resp.data.access_token).replace(/^"(.*)"$/, '$1')
        );
        setGotToken(true);
      })
      .catch((error) => {
        console.log(error);
      });
    return;
  };

  const style = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh', // Optional: Set minimum height for vertical centering
      maxWidth: '50vw', // Set max-width to 50% of the viewport
    },
    row: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 auto', // Center the row horizontally
    },
    button: {
      width: 'auto', // Make the button only as wide as needed
      marginTop: '10px', // Optional: Add margin for spacing
    },
  };

  return (
    <Container style={style.container as React.CSSProperties}>
      {gotToken == false ? (
        <Row style={style.row as React.CSSProperties}>
          <h1>Connect ClickUp Workspaces</h1>
          <Button
            style={style.button}
            variant="dark"
            onClick={() => {
              window.location.href = GetAuthorizationCode(
                APIConstants.client_id,
                APIConstants.redirect_uri
              );
            }}
          >
            Authorize
          </Button>
          {/* <BasicAuth /> */}
        </Row>
      ) : (
        <Row style={style.row as React.CSSProperties}>
          <h1>ClickUp Authorized</h1>

          <Button
            style={style.button}
            variant="dark"
            onClick={() => {
              navigate(`/workspace/${accessToken}`);
            }}
          >
            Explore Workspaces
          </Button>
        </Row>
      )}
    </Container>
  );
}
