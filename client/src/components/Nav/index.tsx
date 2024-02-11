import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Row, ButtonGroup } from "react-bootstrap";

const Nav = () => {
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
    },
  };

  return (
    <>
      <Row style={style.row}>
        <Button href={"/token"} style={style.button} variant="dark">
          Sign in
        </Button>
      </Row>
      {/* <Row style={style.row}>
        <Button href={"/automations"} style={style.button} variant="dark">
          Automations
        </Button>
      </Row> */}
      <Row style={style.row}>
        <Button href={"/logout"} style={style.button} variant="danger">
          Logout
        </Button>
      </Row>
    </>
  );
};

export default Nav;
