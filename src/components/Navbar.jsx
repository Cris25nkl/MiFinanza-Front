import { Navbar, Container, Nav, Button, Image } from 'react-bootstrap';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import logo from './logo/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavigationBar = ({ user, onLogout }) => {
  return (
    <Navbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      fixed="top"
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand href="#home">
          <Image 
            src={logo} 
            alt="Mi Finanza Logo" 
            style={{ height: '40px' }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Item className="d-flex align-items-center me-3">
              <FaUser className="me-2" />
              <span className="text-light">Bienvenido, {user.name}</span>
            </Nav.Item>
            <Nav.Item>
              <Button 
                variant="outline-light" 
                onClick={onLogout}
              >
                <FaSignOutAlt className="me-2" />
                Cerrar Sesión
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar; 