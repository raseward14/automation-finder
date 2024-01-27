import React, { useEffect, useState, useContext } from "react";
import Nav from "../Nav";
import { Outlet } from "react-router-dom";
import { Container, Col, Row, Card } from "react-bootstrap";
import { Button } from "react-bootstrap/lib/InputGroup";

const Layout = () => {
  const style = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    },
  };

  return (
    <Container style={style.container as React.CSSProperties}>
      <Nav />
      <Outlet />
    </Container>
  );
};

export default Layout;
