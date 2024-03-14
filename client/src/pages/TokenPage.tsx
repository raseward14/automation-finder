import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TokenAuth() {
  const [JWT, setJWT] = useState<string>('');
  const [loginURL, setLoginURL] = useState<string>('');
  const [teams, setTeams] = useState<any>();
  const navigate = useNavigate();

  const GetToken = async (): Promise<void> => {
    console.log(loginURL)
    var loginURLTrimmed = loginURL.replace('&ngsw-bypass=1', '');
    var extractedToken = loginURLTrimmed.replace('https://app.clickup.com/?login_token=', '');
    await axios
    .post(`http://localhost:3001/auth/token`, {
      token: extractedToken
    })
    .then((resp) => {
      console.log('from basic.tsx', resp.data);
      setJWT(resp.data.token);
    })
    .catch((error) => {
      console.log(error);
    });
  return;
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    GetToken();
  };

  useEffect(() => {
    console.log('login URL: ', loginURL)
  }, [loginURL])

  useEffect(() => {
    if (teams !== undefined) {
      console.log(teams);
    }
  }, [teams]);

  useEffect(() => {
    if (JWT !== '') {
      localStorage.setItem('jwt', JWT);
      navigate('/oauth')
    }
  }, [JWT]);

  const style = {
    input: {
     width: "100%"
    },
    button: {
      width: 'auto', // Make the button only as wide as needed
      marginTop: '10px', // Optional: Add margin for spacing
    },
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
      </Form.Group>
      <Button style={style.button} variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}
