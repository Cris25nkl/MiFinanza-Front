import { useState, useEffect } from 'react';
import { Card, Form, Button, ProgressBar, Alert } from 'react-bootstrap';
import { FaTrophy, FaPlus, FaTrash, FaBell } from 'react-icons/fa';
import '../styles/FinancialGoals.css';

const FinancialGoals = ({ balance, transactions }) => {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('financialGoals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    category: 'general'
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [amountToAdd, setAmountToAdd] = useState({});

  useEffect(() => {
    localStorage.setItem('financialGoals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (newGoal.name && newGoal.targetAmount && newGoal.deadline) {
      setGoals([...goals, { ...newGoal, id: Date.now() }]);
      setNewGoal({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        deadline: '',
        category: 'general'
      });
      setAlertMessage('¡Meta financiera creada con éxito!');
      setAlertVariant('success');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const handleUpdateProgress = (goalId, amount) => {
    const amountToAdd = parseFloat(amount);
    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      setAlertMessage('Por favor ingrese un monto válido');
      setAlertVariant('danger');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (amountToAdd > balance) {
      setAlertMessage('Saldo insuficiente para realizar esta operación');
      setAlertVariant('danger');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const currentAmount = parseFloat(goal.currentAmount);
        const targetAmount = parseFloat(goal.targetAmount);
        const newAmount = Math.min(currentAmount + amountToAdd, targetAmount);
        
        // Actualizar el saldo disponible
        const remainingBalance = balance - amountToAdd;
        
        setAlertMessage(`¡Has agregado $${amountToAdd.toFixed(2)} a tu meta! Saldo restante: $${remainingBalance.toFixed(2)}`);
        setAlertVariant('success');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);

        return { ...goal, currentAmount: newAmount.toString() };
      }
      return goal;
    }));

    // Limpiar el campo de monto
    setAmountToAdd({ ...amountToAdd, [goalId]: '' });
  };

  const calculateProgress = (current, target) => {
    return (parseFloat(current) / parseFloat(target)) * 100;
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'success';
    if (progress >= 75) return 'info';
    if (progress >= 50) return 'warning';
    return 'danger';
  };

  return (
    <div className="financial-goals-container">
      <h2 className="text-center mb-4">
        <FaTrophy className="me-2" />
        Metas Financieras
      </h2>

      {showAlert && (
        <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}

      <Card className="goal-form-card mb-4">
        <Card.Body>
          <h4>Nueva Meta</h4>
          <Form onSubmit={handleAddGoal}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la Meta</Form.Label>
              <Form.Control
                type="text"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="Ej: Fondo de emergencia"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Monto Objetivo</Form.Label>
              <Form.Control
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha Límite</Form.Label>
              <Form.Control
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
              >
                <option value="general">General</option>
                <option value="emergency">Fondo de Emergencia</option>
                <option value="vacation">Vacaciones</option>
                <option value="education">Educación</option>
                <option value="investment">Inversión</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              <FaPlus className="me-2" />
              Crear Meta
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className="goals-list">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const progressColor = getProgressColor(progress);
          const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

          return (
            <Card key={goal.id} className="goal-card mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5>{goal.name}</h5>
                    <p className="text-muted">
                      Meta: ${parseFloat(goal.targetAmount).toFixed(2)}
                    </p>
                    <p className="text-muted">
                      Actual: ${parseFloat(goal.currentAmount).toFixed(2)}
                    </p>
                    <p className="text-muted">
                      Días restantes: {daysLeft > 0 ? daysLeft : '¡Vencida!'}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>

                <ProgressBar
                  now={progress}
                  variant={progressColor}
                  className="mb-3"
                  label={`${progress.toFixed(1)}%`}
                />

                <div className="d-flex gap-2">
                  <Form.Control
                    type="number"
                    placeholder="Monto a agregar"
                    min="0"
                    step="0.01"
                    value={amountToAdd[goal.id] || ''}
                    onChange={(e) => setAmountToAdd({ ...amountToAdd, [goal.id]: e.target.value })}
                  />
                  <Button 
                    variant="success"
                    onClick={() => handleUpdateProgress(goal.id, amountToAdd[goal.id])}
                    disabled={progress >= 100}
                  >
                    <FaPlus />
                  </Button>
                </div>

                {progress >= 100 && (
                  <Alert variant="success" className="mt-3">
                    <FaBell className="me-2" />
                    ¡Felicidades! Has alcanzado tu meta.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FinancialGoals; 