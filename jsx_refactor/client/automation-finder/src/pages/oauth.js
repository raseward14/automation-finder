import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Constants } from '../constants';
import './style.css';

export default function Oauth({ socket }) {
    const navigate = useNavigate();
    const [accessCode, setAccessCode] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [gotCode, setGotCode] = useState(false);
    const [gotToken, setGotToken] = useState(false);

    let client_id = Constants.client_id;
    let client_secret = Constants.client_secret
    let redirect_uri = Constants.redirect_uri

    const GetAuthorizationCode = () => {
        console.log("getting authorization code...")
        let url = `https://app.clickup.com/api?client_id=${client_id}&redirect_uri=${redirect_uri}`;
        return url;
    };
    
    const SetAuthorizationCode = () => {
        let url = window.location.search;
        setAccessCode(url.replace('?code=', ''));
        console.log( `set access code ${accessCode}, setting GotCode to true.`)
        setGotCode(true);
    };
    
    const GetAccessToken = async () => {
        console.log("getting access token...")
        await axios
          .post(`http://localhost:8080/auth/accesstoken`, {
            client_id: client_id,
            client_secret: client_secret,
            code: accessCode,
          })
          .then((resp) => {
            setAccessToken(
              JSON.stringify(resp.data.access_token).replace(/^"(.*)"$/, '$1')
            );
            console.log(`Set access token to ${accessToken}, setting GotToken to true.`)
            setGotToken(true);
          })
          .catch((error) => {
            console.log(error);
          });
        return;
    };

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

    useEffect(()=>{
        GetAuthorizationCode()
    })

    const style = {
        container: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh', // Optional: Set minimum height for vertical centering
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
        }
    };

    return (
        <Container style={style.container}>
          {gotToken == false ? (
            <Row style={style.row}>
              <h1 className="oauth-header">Connect ClickUp Workspaces</h1>
              <Button
                style={style.button}
                variant="dark"
                onClick={() => {
                  window.location.href = GetAuthorizationCode();
                }}
              >
                Authorize
              </Button>
            </Row>
          ) : (
            <Row style={style.row}>
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