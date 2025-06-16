import { useState } from 'react';
import { Form, Button, Card, Container, Image } from 'react-bootstrap';
import { FaUser, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import logo from './logo/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ onLogin, onShowRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <Image 
              src={logo} 
              alt="Mi Finanza Logo" 
              style={{ height: '80px' }}
            />
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaUser className="me-2" />
                Usuario
              </Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <FaLock className="me-2" />
                Contraseña
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              <FaSignInAlt className="me-2" />
              Iniciar Sesión
            </Button>

            <div className="text-center">
              <p className="mb-0">¿No tienes una cuenta?</p>
              <Button 
                variant="link" 
                onClick={onShowRegister}
                className="p-0"
              >
                <FaUserPlus className="me-2" />
                Regístrate aquí
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login; 