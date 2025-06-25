import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav, Tab } from 'react-bootstrap';
import { FaDollarSign, FaChartBar, FaArrowUp, FaArrowDown, FaUtensils, FaCar, FaHome, FaFilm, FaHeartbeat, FaGraduationCap, FaEllipsisH, FaWallet, FaUsers, FaFileExport, FaBullseye } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Dashboard.css';
import BudgetManager from './BudgetManager';
import FinancialGoals from './FinancialGoals';
import FamilyBudget from './FamilyBudget';
import Reports from './Reports';
import StatisticsPage from './StatisticsPage';
import { createTransaction } from '../utils/axios'; // Importa la
import { useEffect } from 'react';
import { getTransactions } from '../utils/axios'; // Importa la función para obtener transacciones

const CATEGORIAS_GASTOS = [
  { nombre: 'Alimentación', icono: <FaUtensils />, color: '#FF6B6B' },
  { nombre: 'Transporte', icono: <FaCar />, color: '#4ECDC4' },
  { nombre: 'Vivienda', icono: <FaHome />, color: '#45B7D1' },
  { nombre: 'Entretenimiento', icono: <FaFilm />, color: '#96CEB4' },
  { nombre: 'Salud', icono: <FaHeartbeat />, color: '#FF9999' },
  { nombre: 'Educación', icono: <FaGraduationCap />, color: '#9B59B6' },
  { nombre: 'Otros', icono: <FaEllipsisH />, color: '#95A5A6' }
];
const CATEGORIA_INGRESO_ID = '685bc24b6b2fddd375636ca3';

const Dashboard = ({ user }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showStatistics, setShowStatistics] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'ingreso',
    amount: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getTransactions(token)
        .then(res => {
          const txs = res.data.map(tx => ({
            ...tx,
            category: mapearNombreCategoria(tx.categoryId),
          }));
          setTransactions(txs);

          const nuevoBalance = txs.reduce((acc, tx) => {
            return tx.type === 'ingreso'
              ? acc + tx.amount
              : acc - tx.amount;
          }, 0);

          setBalance(nuevoBalance);
        });
    }
  }, []);

  const categoriasNombrePorId = {
    '685ba12c964a231833ddef76': 'Alimentación',
    '681b940648435712620d1a75': 'Transporte',
    '685ba19e964a231833ddef78': 'Vivienda',
    '685ba1a7964a231833ddef7a': 'Entretenimiento',
    '685ba1c3964a231833ddef7c': 'Salud',
    '685ba1c9964a231833ddef7e': 'Educación',
    '685ba1d0964a231833ddef80': 'Otros'
  };
  
  const mapearNombreCategoria = (id) => {
    return categoriasNombrePorId[id] || '';
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
  
    const amount = parseFloat(newTransaction.amount);
    const token = localStorage.getItem('token');
  
    const payload = {
      amount,
      description: newTransaction.description,
      type: newTransaction.type, // 'ingreso' o 'gasto'
      categoryId: newTransaction.type === 'gasto'
        ? await obtenerCategoryIdPorNombre(newTransaction.category)
        : CATEGORIA_INGRESO_ID, // usar categoría "Ingreso"
    };
  
    try {
      const response = await createTransaction(payload, token);
      const saved = response.data;
  
      const updatedBalance = newTransaction.type === 'ingreso'
        ? balance + saved.amount
        : balance - saved.amount;
  
      setBalance(updatedBalance);
      setTransactions([...transactions, {
        ...saved,
        type: newTransaction.type,
        category: newTransaction.category || 'Ingreso',
      }]);
  
      setNewTransaction({ type: 'ingreso', amount: '', description: '', category: '' });
    } catch (error) {
      console.error('Error al guardar transacción:', error);
      alert('Error al guardar la transacción');
    }
  };

  const categoriasMapeadas = {
    'Alimentación': '685ba12c964a231833ddef76',
    'Transporte': '681b940648435712620d1a75',
    'Vivienda': '685ba19e964a231833ddef78',
    'Entretenimiento': '685ba1a7964a231833ddef7a',
    'Salud': '685ba1c3964a231833ddef7c',
    'Educación': '685ba1c9964a231833ddef7e',
    'Otros': '685ba1d0964a231833ddef80'
  };
  
  const obtenerCategoryIdPorNombre = async (nombre) => {
    return categoriasMapeadas[nombre];
  };

  if (showStatistics) {
    return <StatisticsPage transactions={transactions} onBack={() => setShowStatistics(false)}/>;
  }

  return (
    <Container fluid className="dashboard-container py-4 mt-5">
      <div className="d-flex justify-content-end mb-4">
        <Button 
          variant="primary" 
          onClick={() => setShowStatistics(true)}
          className="statistics-btn"
        >
          <FaChartBar className="me-2" />
          Ver Estadísticas
        </Button>
      </div>
      
      <Row className="mb-4">
        <Col md={4} className="mx-auto">
          <Card className="balance-card text-center">
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

      <Tab.Container defaultActiveKey="transactions">
        <Row>
          <Col>
            <Nav variant="pills" className="mb-4 custom-tabs">
              <Nav.Item>
                <Nav.Link eventKey="transactions">
                  <FaWallet className="me-2" />
                  Transacciones
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="budgets">
                  <FaChartBar className="me-2" />
                  Presupuestos
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="goals">
                  <FaBullseye className="me-2" />
                  Metas
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="family">
                  <FaUsers className="me-2" />
                  Familiar
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reports">
                  <FaFileExport className="me-2" />
                  Reportes
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        <Tab.Content>
          <Tab.Pane eventKey="transactions">
            <Row>
              <Col md={6} lg={4}>
                <Card className="transaction-form-card">
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
                          className="form-select-custom"
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
                            className="form-select-custom"
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
                          className="form-control-custom"
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
                          className="form-control-custom"
                        />
                      </Form.Group>

                      <Button variant="primary" type="submit" className="w-100 submit-btn">
                        Agregar Transacción
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={8}>
                <Card className="transactions-card">
                  <Card.Body>
                    <h4>Historial de Transacciones</h4>
                    <div className="transactions-list">
                      {transactions.map((transaction, index) => (
                        <div
                          key={index}
                          className={`transaction-item ${
                            transaction.type === 'ingreso' ? 'income' : 'expense'
                          }`}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>
                                {transaction.type === 'ingreso' ? 
                                  <FaArrowUp className="me-2 text-success" /> : 
                                  <FaArrowDown className="me-2 text-danger" />
                                }
                                {transaction.description}
                              </strong>
                              <br />
                              <small>{transaction.date}</small>
                              {transaction.type === 'gasto' && transaction.category && transaction.category !== 'Ingreso' && (
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
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          <Tab.Pane eventKey="budgets">
            <BudgetManager transactions={transactions} />
          </Tab.Pane>

          <Tab.Pane eventKey="goals">
            <FinancialGoals balance={balance} transactions={transactions} />
          </Tab.Pane>

          <Tab.Pane eventKey="family">
            <FamilyBudget transactions={transactions} />
          </Tab.Pane>

          <Tab.Pane eventKey="reports">
            <Reports transactions={transactions} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default Dashboard; 