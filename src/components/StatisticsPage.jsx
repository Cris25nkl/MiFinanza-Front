import { Container, Button } from 'react-bootstrap';
import Statistics from './Statistics';
import 'bootstrap/dist/css/bootstrap.min.css';

const StatisticsPage = ({ transactions, onBack }) => {
  return (
    <Container className="py-4 mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Estadísticas</h2>
        <Button variant="outline-primary" onClick={onBack}>
          Volver al Dashboard
        </Button>
      </div>
      <Statistics transactions={transactions} />
    </Container>
  );
};

export default StatisticsPage; 