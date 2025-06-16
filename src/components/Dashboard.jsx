import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaDollarSign, FaChartBar, FaArrowUp, FaArrowDown, FaUtensils, FaCar, FaHome, FaFilm, FaHeartbeat, FaGraduationCap, FaEllipsisH } from 'react-icons/fa';

const CATEGORIAS_GASTOS = [
  { nombre: 'Alimentación', icono: <FaUtensils /> },
  { nombre: 'Transporte', icono: <FaCar /> },
  { nombre: 'Vivienda', icono: <FaHome /> },
  { nombre: 'Entretenimiento', icono: <FaFilm /> },
  { nombre: 'Salud', icono: <FaHeartbeat /> },
  { nombre: 'Educación', icono: <FaGraduationCap /> },
  { nombre: 'Otros', icono: <FaEllipsisH /> }
];

const Dashboard = ({ user, onShowStatistics }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    type: 'ingreso',
    amount: '',
    description: '',
    category: ''
  });

  const handleTransaction = (e) => {
    e.preventDefault();
    const amount = parseFloat(newTransaction.amount);
    const updatedBalance = newTransaction.type === 'ingreso' 
      ? balance + amount 
      : balance - amount;

    setBalance(updatedBalance);
    setTransactions([
      ...transactions,
      {
        ...newTransaction,
        amount,
        date: new Date().toLocaleDateString()
      }
    ]);
    setNewTransaction({ type: 'ingreso', amount: '', description: '', category: '' });
  };

  return (
    <Container className="py-4 mt-5">
      <div className="d-flex justify-content-end mb-4">
        <Button variant="primary" onClick={onShowStatistics}>
          <FaChartBar className="me-2" />
          Ver Estadísticas
        </Button>
      </div>
      
      <Row className="mb-4">
        <Col md={6} className="mx-auto">
          <Card className="text-center">
            <Card.Body>
              <h3>Balance Actual</h3>
              <h2 className={balance >= 0 ? 'text-success' : 'text-danger'}>
                <FaDollarSign className="me-2" />
                {balance.toFixed(2)}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mx-auto">
          <Card>
            <Card.Body>
              <h4 className="mb-3">Nueva Transacción</h4>
              <Form onSubmit={handleTransaction}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({
                      ...newTransaction,
                      type: e.target.value,
                      category: e.target.value === 'ingreso' ? '' : newTransaction.category
                    })}
                  >
                    <option value="ingreso">
                      <FaArrowUp className="me-2" /> Ingreso
                    </option>
                    <option value="gasto">
                      <FaArrowDown className="me-2" /> Gasto
                    </option>
                  </Form.Select>
                </Form.Group>

                {newTransaction.type === 'gasto' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction({
                        ...newTransaction,
                        category: e.target.value
                      })}
                      required
                    >
                      <option value="">Seleccione una categoría</option>
                      {CATEGORIAS_GASTOS.map((categoria) => (
                        <option key={categoria.nombre} value={categoria.nombre}>
                          {categoria.icono} {categoria.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Monto</Form.Label>
                  <Form.Control
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({
                      ...newTransaction,
                      amount: e.target.value
                    })}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({
                      ...newTransaction,
                      description: e.target.value
                    })}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Agregar Transacción
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Body>
              <h4>Historial de Transacciones</h4>
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className={`p-2 mb-2 border rounded ${
                    transaction.type === 'ingreso' ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'
                  }`}
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>
                        {transaction.type === 'ingreso' ? <FaArrowUp className="me-2 text-success" /> : <FaArrowDown className="me-2 text-danger" />}
                        {transaction.description}
                      </strong>
                      <br />
                      <small>{transaction.date}</small>
                      {transaction.type === 'gasto' && transaction.category && (
                        <>
                          <br />
                          <small className="text-muted">
                            {CATEGORIAS_GASTOS.find(cat => cat.nombre === transaction.category)?.icono} 
                            Categoría: {transaction.category}
                          </small>
                        </>
                      )}
                    </div>
                    <div className={transaction.type === 'ingreso' ? 'text-success' : 'text-danger'}>
                      {transaction.type === 'ingreso' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 