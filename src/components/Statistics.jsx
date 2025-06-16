import { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = ({ transactions }) => {
  const [chartData, setChartData] = useState({
    ingresos: [],
    gastos: [],
    labels: []
  });

  useEffect(() => {
    // Agrupar transacciones por fecha
    const groupedData = transactions.reduce((acc, transaction) => {
      const date = transaction.date;
      if (!acc[date]) {
        acc[date] = { ingresos: 0, gastos: 0 };
      }
      if (transaction.type === 'ingreso') {
        acc[date].ingresos += transaction.amount;
      } else {
        acc[date].gastos += transaction.amount;
      }
      return acc;
    }, {});

    // Ordenar fechas
    const sortedDates = Object.keys(groupedData).sort();
    
    // Preparar datos para los gráficos
    const ingresos = sortedDates.map(date => groupedData[date].ingresos);
    const gastos = sortedDates.map(date => groupedData[date].gastos);

    setChartData({
      ingresos,
      gastos,
      labels: sortedDates
    });
  }, [transactions]);

  const ingresosOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ingresos por Día',
      },
    },
  };

  const gastosOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gastos por Día',
      },
    },
  };

  const comparativaOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Comparativa Ingresos vs Gastos',
      },
    },
  };

  const ingresosData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Ingresos',
        data: chartData.ingresos,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const gastosData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Gastos',
        data: chartData.gastos,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const comparativaData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Ingresos',
        data: chartData.ingresos,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Gastos',
        data: chartData.gastos,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="mt-4">
      <h2 className="text-center mb-4">Estadísticas</h2>
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Bar options={ingresosOptions} data={ingresosData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Bar options={gastosOptions} data={gastosData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Line options={comparativaOptions} data={comparativaData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics; 