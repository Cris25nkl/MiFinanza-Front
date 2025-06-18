import { useState } from 'react';
import { Card, Form, Button, Table, Spinner } from 'react-bootstrap';
import { FaFileExport, FaFilePdf, FaFileExcel, FaChartBar } from 'react-icons/fa';
import '../styles/Reports.css';

const Reports = ({ transactions }) => {
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async (format) => {
    setIsGenerating(true);
    try {
      // Filtrar transacciones por rango de fechas
      const filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= new Date(dateRange.start) && 
               transactionDate <= new Date(dateRange.end);
      });

      // Calcular totales
      const totals = {
        income: filteredTransactions
          .filter(t => t.type === 'ingreso')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0),
        expenses: filteredTransactions
          .filter(t => t.type === 'gasto')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      };

      // Agrupar gastos por categoría
      const expensesByCategory = filteredTransactions
        .filter(t => t.type === 'gasto')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
          return acc;
        }, {});

      // Crear el contenido del reporte
      const reportContent = {
        dateRange,
        totals,
        expensesByCategory,
        transactions: filteredTransactions
      };

      // Simular la generación del reporte
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Aquí iría la lógica real de exportación
      console.log('Reporte generado:', reportContent);
      
      // Mostrar mensaje de éxito
      alert(`Reporte generado exitosamente en formato ${format}`);
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      alert('Error al generar el reporte');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="reports-container">
      <h2 className="text-center mb-4">
        <FaChartBar className="me-2" />
        Reportes Financieros
      </h2>

      <Card className="report-form-card">
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Reporte</Form.Label>
              <Form.Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="monthly">Mensual</option>
                <option value="quarterly">Trimestral</option>
                <option value="yearly">Anual</option>
                <option value="custom">Personalizado</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha Fin</Form.Label>
              <Form.Control
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                required
              />
            </Form.Group>

            <div className="export-buttons">
              <Button
                variant="primary"
                className="export-btn"
                onClick={() => generateReport('PDF')}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <FaFilePdf className="me-2" />
                    Exportar PDF
                  </>
                )}
              </Button>

              <Button
                variant="success"
                className="export-btn"
                onClick={() => generateReport('Excel')}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <FaFileExcel className="me-2" />
                    Exportar Excel
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="report-preview-card mt-4">
        <Card.Body>
          <h4>Vista Previa del Reporte</h4>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter(t => {
                  if (!dateRange.start || !dateRange.end) return true;
                  const transactionDate = new Date(t.date);
                  return transactionDate >= new Date(dateRange.start) && 
                         transactionDate <= new Date(dateRange.end);
                })
                .map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.date}</td>
                    <td>
                      <span className={`badge bg-${transaction.type === 'ingreso' ? 'success' : 'danger'}`}>
                        {transaction.type === 'ingreso' ? 'Ingreso' : 'Gasto'}
                      </span>
                    </td>
                    <td>{transaction.category || '-'}</td>
                    <td>{transaction.description}</td>
                    <td className={transaction.type === 'ingreso' ? 'text-success' : 'text-danger'}>
                      {transaction.type === 'ingreso' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Reports; 