import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaSignOutAlt, FaWallet } from 'react-icons/fa';
import '../styles/Navbar.css';

function NavigationBar({ user, onLogout }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar" fixed="top">
      <Container>
        <Navbar.Brand href="#home" className="navbar-brand">
          <FaWallet className="navbar-logo" />
          <span className="ms-2">MiFinanza</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Item className="d-flex align-items-center">
              <span className="welcome-text me-3">Bienvenido, {user.name}</span>
              <button
                onClick={onLogout}
                className="btn btn-outline-light d-flex align-items-center"
              >
                <FaSignOutAlt className="me-2" />
                Cerrar Sesión
              </button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar; 