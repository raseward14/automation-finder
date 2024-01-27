import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Row, ButtonGroup } from "react-bootstrap";

const Nav = () => {
  const logout = async () => {
    console.log("clicked");
    try {
      // an api request to logout
      // possibly clear creds from session storage if there
      // window.location.reload(false);
      // console.log(response.data)
      console.log("try block executed");
    } catch (err) {
      console.log(`got an error ${err}`);
      // if(!err.response) {
      //     setErrMsg('No server response...')
      // } else if (err?.response) {
      //     console.log(err.response)
      // } else {
      //     console.log('you are logged out!')
      // }
    }
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
        <Button href={"/oauth"} style={style.button} variant="dark">
          Connect ClickUp
        </Button>
      </Row>
      <Row style={style.row}>
        <Button href={"/automations"} style={style.button} variant="dark">
          Automations
        </Button>
      </Row>
      <Row style={style.row}>
        <Button href={"/logout"} style={style.button} variant="danger">
          Logout
        </Button>
      </Row>
    </>
  );
};

export default Nav;
