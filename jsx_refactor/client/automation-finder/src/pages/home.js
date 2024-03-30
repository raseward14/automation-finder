import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Home({ socket }) {

    const [loginURL, setLoginURL] = useState('');
    const [JWT, setJWT] = useState('');
    const [teams, setTeams] = useState();
    const navigate = useNavigate();

    const GetToken = async () => {
        socket.emit("message", {message: "Trying to login with bypass..."});
        var loginURLTrimmed = loginURL.replace('&ngsw-bypass=1', '');
        var extractedToken = loginURLTrimmed.replace('https://app.clickup.com/?login_token=', '');
        await axios
        .post(`http://localhost:8080/auth/token`, {
          token: extractedToken
        })
        .then((resp) => {
          setJWT(resp.data.token);

        })
        .catch((error) => {
          console.log(error);
        });
      return;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        GetToken()
      };

    useEffect(() => {
        if (JWT !== '') {
          socket.emit("loginBypassSucessful", {jwt: JWT})
          localStorage.setItem('jwt', JWT);
          navigate('/oauth')
        }
      }, [JWT]);

    const style = {
        container: {},
    };
  
    return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>CRM Login Link</Form.Label>
        <Form.Control
          style={style.input}
          type="text"
          placeholder="login link"
          className="form-input"
          value={loginURL}
          onChange={(e) => setLoginURL(e.target.value)}
          required
        />
      </Form.Group><br />
      <Button style={style.button} variant="primary" type="submit">
        Submit
      </Button>
    </Form>
       
    );
}