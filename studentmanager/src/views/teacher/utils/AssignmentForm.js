import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert, Row, Col, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const AssignmentFormModal = ({ visible, onClose, assignment, refreshAssignments }) => {
  const [formData, setFormData] = useState({
    class_id: '',
    title: '',
    description: '',
    due_date: '',
    points: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (assignment) {
      setFormData({
        class_id: assignment.class_id || '',
        title: assignment.title || '',
        description: assignment.description || '',
        due_date: assignment.due_date || '',
        points: assignment.points || ''
      });
    } else {
      setFormData({
        class_id: '',
        title: '',
        description: '',
        due_date: '',
        points: ''
      });
    }
    setErrors({});
  }, [assignment, visible]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('/class/specific-class');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    if (visible) {
      fetchClasses();
    }
  }, [visible]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.class_id) newErrors.class_id = 'Course selection is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.due_date) newErrors.due_date = 'Due date is required';
    if (!formData.points || formData.points <= 0) newErrors.points = 'Valid points are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (assignment) {
        await axios.put(`/assignment/${assignment.id}`, formData);
        toast.success('Assignment updated successfully');
      } else {
        await axios.post('/assignment', formData);
        toast.success('Assignment created successfully');
      }
      refreshAssignments();
      onClose();
    } catch (error) {
      console.error('Error saving assignment:', error);
      const message = error.response?.data?.message || error.message || "Something went wrong";
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Modal show={visible} onHide={onClose} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-dark">
            {assignment ? 'Edit Assignment' : 'Create New Assignment'}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="pt-0">
          {errors.api && (
            <Alert variant="danger" className="mb-4">
              {errors.api}
            </Alert>
          )}

          <Row className="g-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Course <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.class_id}
                  onChange={(e) => setFormData({...formData, class_id: e.target.value})}
                  isInvalid={!!errors.class_id}
                >
                  <option value="">Select a course...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.title} (ID: {cls.id})
                    </option>
                  ))}
                </Form.Select>
                {errors.class_id && (
                  <Form.Text className="text-danger">{errors.class_id}</Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Points <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter points (e.g., 100)"
                  value={formData.points}
                  onChange={(e) => setFormData({...formData, points: e.target.value})}
                  isInvalid={!!errors.points}
                  min="1"
                />
                {errors.points && (
                  <Form.Text className="text-danger">{errors.points}</Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Title <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter assignment title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              isInvalid={!!errors.title}
            />
            {errors.title && (
              <Form.Text className="text-danger">{errors.title}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Description <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter assignment description and instructions"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              isInvalid={!!errors.description}
            />
            {errors.description && (
              <Form.Text className="text-danger">{errors.description}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              Due Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="datetime-local"
              value={formData.due_date}
              onChange={(e) => setFormData({...formData, due_date: e.target.value})}
              isInvalid={!!errors.due_date}
            />
            {errors.due_date && (
              <Form.Text className="text-danger">{errors.due_date}</Form.Text>
            )}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {assignment ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              assignment ? 'Update Assignment' : 'Create Assignment'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AssignmentFormModal;