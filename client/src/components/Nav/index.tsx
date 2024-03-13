import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Row, ButtonGroup } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ClickUpIcon from '../images/clickup.jpeg';
import './style.css';

type NavPropList = {
  JWT: string;
}

const NavComponent = (props: NavPropList) => {
  const yourToken = localStorage.getItem('jwt');
  const [storedToken, setStoredToken] = useState<any>(localStorage.getItem('jwt'))
  const [JWT, setJWT] = useState(props.JWT);

  const logout = async () => {
    localStorage.removeItem('token');
  };

  // useEffect(() => {
    // this doesnt work, bc when we load the workspace.tsx page, the nav component re-loads, and this runs removing the token
    // we need to set something to true, in a location that only loads when the app starts
    // if(storedToken) {
      // console.log('stored token exists:', storedToken);
      // localStorage.removeItem('jwt');
      // setJWT(storedToken);
  //   } else {
  //     console.log(`no stored token: ${storedToken}`)
  //   }
  //   console.log(`jwt from nav: ${JWT}`)
  // }, [JWT, storedToken]);

  useEffect(() => {
    console.log(`nav component loaded`);
    console.log(`jwt value: ${JWT}`);
    console.log(`this is in local storage: ${localStorage.getItem('jwt')}`)
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
              {(JWT.length > 1) ? (
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
    </>
  );
};

export default NavComponent;
