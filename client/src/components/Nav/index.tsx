import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Row, ButtonGroup } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './style.css';


const NavComponent = () => {
  const yourToken = localStorage.getItem('token');


  const logout = async () => {
    localStorage.removeItem('token');
  };

  const style = {
    row: {
      margin: "0 auto",
    },
    button: {
      margin: 3,
      padding: "10px 20px", // Adjust padding as needed
      backgroundColor: "#4CAF50", // Button background color
      color: "#fff", // Button text color
      border: "none", // Remove button border
      borderRadius: "5px", // Optional: Add border-radius for rounded corners
      cursor: "pointer",
    }
  };

  return (
    <>

      <Navbar expand="lg" className="navBar bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">Automation Finder</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {yourToken ? (
              <Nav.Link href={"/"} onClick={logout}>Logout</Nav.Link>

              ) : (
                <>
                <Nav.Link href={"/token"}>CRM Link</Nav.Link>
                <Nav.Link href={"/basic"}>Password</Nav.Link>
                </>
  
              )}
              {/* <Nav.Link href={"/token"}>CRM Link</Nav.Link>
              <Nav.Link href={"/basic"}>Password</Nav.Link>
              <Nav.Link href={"/"} onClick={logout}>Logout</Nav.Link> */}

              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


      {/* <Row style={style.row}>
        <Button href={"/token"} style={style.button} variant="dark">
          CRM Link
        </Button>
      </Row>
      <Row style={style.row}>
        <Button href={"/basic"} style={style.button} variant="dark">
          Password
        </Button>
      </Row>
      <Row style={style.row}>
        <Button
          href={"/"}
          style={style.button}
          variant="danger"
          onClick={logout}>
          Logout
        </Button>
      </Row> */}
    </>
  );
};

export default NavComponent;
