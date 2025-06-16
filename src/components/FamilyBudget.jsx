import { useState, useEffect } from 'react';
import { Card, Form, Button, Table, Badge, Modal } from 'react-bootstrap';
import { FaUsers, FaUserPlus, FaUserMinus, FaLock, FaUnlock } from 'react-icons/fa';
import './FamilyBudget.css';

const FamilyBudget = ({ transactions }) => {
  const [familyMembers, setFamilyMembers] = useState(() => {
    const savedMembers = localStorage.getItem('familyMembers');
    return savedMembers ? JSON.parse(savedMembers) : [];
  });

  const [newMember, setNewMember] = useState({
    name: '',
    role: 'member',
    budget: '0'
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
  }, [familyMembers]);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (newMember.name) {
      setFamilyMembers([...familyMembers, { ...newMember, id: Date.now() }]);
      setNewMember({ name: '', role: 'member', budget: '0' });
      setShowAddModal(false);
    }
  };

  const handleRemoveMember = (memberId) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== memberId));
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleUpdateMember = (e) => {
    e.preventDefault();
    if (selectedMember) {
      setFamilyMembers(familyMembers.map(member =>
        member.id === selectedMember.id ? selectedMember : member
      ));
      setShowEditModal(false);
    }
  };

  const calculateMemberSpending = (memberId) => {
    return transactions
      .filter(t => t.memberId === memberId && t.type === 'gasto')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  const getSpendingStatus = (spent, budget) => {
    const percentage = (spent / parseFloat(budget)) * 100;
    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  return (
    <div className="family-budget-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <FaUsers className="me-2" />
          Presupuesto Familiar
        </h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FaUserPlus className="me-2" />
          Agregar Miembro
        </Button>
      </div>

      <Card className="family-members-card">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Presupuesto</th>
                <th>Gastado</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {familyMembers.map(member => {
                const spent = calculateMemberSpending(member.id);
                const status = getSpendingStatus(spent, member.budget);
                return (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>
                      <Badge bg={member.role === 'admin' ? 'primary' : 'secondary'}>
                        {member.role === 'admin' ? 'Administrador' : 'Miembro'}
                      </Badge>
                    </td>
                    <td>${parseFloat(member.budget).toFixed(2)}</td>
                    <td>${spent.toFixed(2)}</td>
                    <td>
                      <Badge bg={status}>
                        {status === 'danger' ? 'Excedido' : 
                         status === 'warning' ? 'Cerca del límite' : 'Bien'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditMember(member)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <FaUserMinus />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para agregar miembro */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Miembro Familiar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMember}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              >
                <option value="member">Miembro</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Presupuesto Mensual</Form.Label>
              <Form.Control
                type="number"
                value={newMember.budget}
                onChange={(e) => setNewMember({ ...newMember, budget: e.target.value })}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Agregar Miembro
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para editar miembro */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Miembro Familiar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMember && (
            <Form onSubmit={handleUpdateMember}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedMember.name}
                  onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  value={selectedMember.role}
                  onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value })}
                >
                  <option value="member">Miembro</option>
                  <option value="admin">Administrador</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Presupuesto Mensual</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedMember.budget}
                  onChange={(e) => setSelectedMember({ ...selectedMember, budget: e.target.value })}
                  min="0"
                  step="0.01"
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Guardar Cambios
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FamilyBudget; 