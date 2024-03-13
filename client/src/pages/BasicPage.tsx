import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

type BasicPropList = {
  JWTCallback: (a: string) => void;
}

export default function BasicAuth(props: BasicPropList) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [JWT, setJWT] = useState<string>('');
  const [teams, setTeams] = useState<any>();
  const navigate = useNavigate();

  const GetJWT = async (): Promise<void> => {
    await axios
      .post(`http://localhost:3001/auth/basic`, {
        email: email,
        password: password,
      })
      .then((resp) => {
        console.log('from basic.tsx', resp.data);
        setJWT(resp.data.token);
        props.JWTCallback(resp.data.token);
        setTeams(resp.data.teams);
      })
      .catch((error) => {
        console.log(error);
      });
    return;
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    GetJWT();
  };

  useEffect(() => {
    if (teams !== undefined) {
      console.log(teams);
    }
  }, [teams]);

  useEffect(() => {
    if (JWT !== '') {
      console.log('jwt set', JWT)
      localStorage.setItem('jwt', JWT);
      navigate('/oauth')
      // console.log('show connect clickup OAuth button')
    }
  }, [JWT]);

  const style = {
    container: {
        margin: "5% 10% 10% 10%"
    },
    button: {
      width: 'auto', // Make the button only as wide as needed
      marginTop: '10px', // Optional: Add margin for spacing
    },
  };

  return (
    <Form style={style.container} onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Button style={style.button} variant="primary" type="submit">
        Submit
      </Button>
      {/* <h1>{token}</h1> */}
    </Form>
  );
}
