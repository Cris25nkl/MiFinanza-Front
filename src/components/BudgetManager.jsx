import { useState, useEffect } from 'react';
import { Card, Form, Button, ProgressBar, Row, Col } from 'react-bootstrap';
import { FaUtensils, FaCar, FaHome, FaFilm, FaHeartbeat, FaGraduationCap, FaEllipsisH, FaPlus, FaTrash } from 'react-icons/fa';
import '../styles/BudgetManager.css';

const CATEGORIAS_GASTOS = [
  { nombre: 'Alimentación', icono: <FaUtensils />, color: '#FF6B6B' },
  { nombre: 'Transporte', icono: <FaCar />, color: '#4ECDC4' },
  { nombre: 'Vivienda', icono: <FaHome />, color: '#45B7D1' },
  { nombre: 'Entretenimiento', icono: <FaFilm />, color: '#96CEB4' },
  { nombre: 'Salud', icono: <FaHeartbeat />, color: '#FF9999' },
  { nombre: 'Educación', icono: <FaGraduationCap />, color: '#9B59B6' },
  { nombre: 'Otros', icono: <FaEllipsisH />, color: '#95A5A6' }
];

const BudgetManager = ({ transactions }) => {
  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : [];
  });

  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
    month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  });

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (newBudget.category && newBudget.amount) {
      setBudgets([...budgets, { ...newBudget, amount: parseFloat(newBudget.amount) }]);
      setNewBudget({ category: '', amount: '', month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) });
    }
  };

  const handleDeleteBudget = (index) => {
    const newBudgets = budgets.filter((_, i) => i !== index);
    setBudgets(newBudgets);
  };

  const calculateCategorySpending = (category) => {
    return transactions
      .filter(t => t.type === 'gasto' && t.category === category)
      .reduce((total, t) => total + t.amount, 0);
  };

  const getProgressColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  return (
    <div className="budget-manager">
      <Card className="budget-form-card">
        <Card.Body>
          <h4 className="mb-4">Crear Nuevo Presupuesto</h4>
          <Form onSubmit={handleAddBudget}>
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
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
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Monto Límite</Form.Label>
                  <Form.Control
                    type="number"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="form-control-custom"
                    placeholder="Ingrese el monto límite"
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button type="submit" className="add-budget-btn w-100">
                  <FaPlus className="me-2" />
                  Agregar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <div className="budgets-list mt-4">
        <h4 className="mb-4">Presupuestos Mensuales</h4>
        <Row>
          {budgets.map((budget, index) => {
            const spent = calculateCategorySpending(budget.category);
            const progress = (spent / budget.amount) * 100;
            const category = CATEGORIAS_GASTOS.find(c => c.nombre === budget.category);

            return (
              <Col md={6} lg={4} key={index} className="mb-4">
                <Card className="budget-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <span className="category-icon" style={{ color: category?.color }}>
                          {category?.icono}
                        </span>
                        <h5 className="mb-0 ms-2">{budget.category}</h5>
                      </div>
                      <Button
                        variant="link"
                        className="delete-btn"
                        onClick={() => handleDeleteBudget(index)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                    <div className="budget-info">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Gastado: ${spent.toFixed(2)}</span>
                        <span>Límite: ${budget.amount.toFixed(2)}</span>
                      </div>
                      <ProgressBar
                        now={progress}
                        variant={getProgressColor(spent, budget.amount)}
                        className="budget-progress"
                      />
                      <div className="text-center mt-2">
                        <small className="text-muted">{budget.month}</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default BudgetManager; 