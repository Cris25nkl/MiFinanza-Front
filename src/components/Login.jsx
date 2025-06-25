import { useState } from 'react';
import { Form, Button, Card, Container, Image, Alert } from 'react-bootstrap';
import { FaUser, FaLock, FaSignInAlt, FaUserPlus, FaExclamationTriangle } from 'react-icons/fa';
import logo from './logo/newLogo.jpeg';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../utils/axios';

const Login = ({ onLogin, onShowRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      const { access_token, user } = response.data;
      console.log('Login exitoso:', response);

      // Guardar token localmente (por ejemplo)
      localStorage.setItem('token', access_token);

      // Llamar a la función que maneja el login en App.jsx (o donde sea)
      onLogin(user);
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Usuario o contraseña incorrectos');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar el error cuando el usuario empiece a escribir
    if (error) setError('');
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
          {error && (
            <Alert variant="danger" className="mb-3">
              <FaExclamationTriangle className="me-2" />
              {error}
            </Alert>
          )}
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