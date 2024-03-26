import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Row, ButtonGroup } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ClickUpIcon from '../images/clickup.jpeg';
import './style.css';

const NavComponent = ({ socket }) => {
  const [JWTPresent, setJWTPresent] = useState(false)

  const logout = async () => {
    localStorage.removeItem('token');
  };

  useEffect(() => {
   const currentLocation = window.location.href;
   if(currentLocation.includes('oauth')){
    setJWTPresent(true)
   }
    console.log('current location', currentLocation);
  }, [])

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
          <Navbar.Brand href="/"><img className="clickup-icon-dark" src={ClickUpIcon}></img>Automation Finder</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {JWTPresent ? (
                <Nav.Link href={"/"} onClick={logout}>Logout</Nav.Link>
              ) : (
                <>
                  <Nav.Link href={"/"}>CRM Link</Nav.Link>
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
    </>
  );
};

export default NavComponent;
