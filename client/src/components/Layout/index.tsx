import React, { useEffect, useState, useContext } from 'react';
import Nav from '../Nav';
import { Outlet } from 'react-router-dom';
import { Container, Col, Row, Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap/lib/InputGroup';
import './style.css';

type LayoutPropList = {
  JWT: string;
};

const Layout = (props: LayoutPropList) => {
  const [JWT, setJWT] = useState<string>(props.JWT);

  // useEffect(() => {
  //   console.log(`from layout.tsx jwt is: ${JWT}`)
  // }, [JWT])


  const style = {
    container: {
      minHeight: '100vh',
      minWidth: '100vw',
      background: 'gray',
      position: 'absolute',
      zindex: '0',
    },
  };

  return (
    <Container style={style.container as React.CSSProperties}>
      <Nav JWT={JWT} />
      <div className={'page-container'}>
        <Outlet />
      </div>
    </Container>
  );
};

export default Layout;
