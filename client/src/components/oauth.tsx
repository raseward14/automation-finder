import React, { useEffect, useState } from "react";
import axios from "axios";
import { APIConstants } from "../constants"; //object of secret values: export const APIConstants = { key: value} hidden by gitignore
import { Button, Col } from "react-bootstrap";
import { ClientToServerEvents, ServerToClientEvents } from "../models/socket";
import { Socket, io } from "socket.io-client";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3002"
);

export default function OAuthClickUp() {
  const [accessCode, setAccessCode] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [gotCode, setGotCode] = useState<boolean>(false);
  const [gotToken, setGotToken] = useState<boolean>(false);

  useEffect(() => {
    if (window.location.pathname === "/oauth/success" && gotCode === false) {
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
    setAccessCode(url.replace("?code=", ""));
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
        setAccessToken(JSON.stringify(resp.data.access_token));
        setGotToken(true);
      })
      .catch((error) => {
        console.log(error);
      });
    return;
  };

  return (
    <div>
      {gotToken == false ? (
        <Col>
          <h1>Integrate with ClickUp?</h1>
          <Button
            variant="dark"
            onClick={() => {
              window.location.href = GetAuthorizationCode(
                APIConstants.client_id,
                APIConstants.redirect_uri
              );
            }}>
            Authorize
          </Button>
        </Col>
      ) : (
        <Col>
          <h1>ClickUp Authorized</h1>
          <h2>Access Code: {accessCode}</h2>
          <h2>Access Token: {accessToken}</h2>
        </Col>
      )}
    </div>
  );
}
