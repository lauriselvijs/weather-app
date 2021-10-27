import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

function Header() {
  return (
    <div className="header">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Weather App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="https://www.weatherapi.com/" target="_blank">
              Weather API
            </Nav.Link>
            <Nav.Link href="https://www.weatherapi.com/docs/" target="_blank">
              Help
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
