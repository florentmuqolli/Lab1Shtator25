import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Badge, Modal, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    due_date: '',
    points: '',
    class_id: ''
  });

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/assignment');
      setAssignments(res.data);
      setFilteredAssignments(res.data);
      toast.success('Assignments loaded successfully');
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const viewStats = async (assignment) => {
    setLoading(true);
    try {
      const res = await axios.get(`/assignment/${assignment.id}/activity`);
      setSelectedAssignment({ ...assignment, submissions: res.data });
      setShowStatsModal(true);
      toast.success('Statistics loaded successfully');
    } catch (err) {
      console.error('Failed to load submissions:', err);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (assignment) => {
    try {
      await axios.put(`/assignment/${assignment.id}`, {
        ...assignment,
        visible: !assignment.visible
      });
      fetchAssignments();
      toast.success(`Assignment ${!assignment.visible ? 'published' : 'hidden'} successfully`);
    } catch (error) {
      console.error('Failed to update assignment:', error);
      toast.error('Failed to update assignment');
    }
  };

  const createAssignment = async () => {
    try {
      await axios.post('/assignment', newAssignment);
      setShowCreateModal(false);
      setNewAssignment({
        title: '',
        description: '',
        due_date: '',
        points: '',
        class_id: ''
      });
      fetchAssignments();
      toast.success('Assignment created successfully');
    } catch (error) {
      console.error('Failed to create assignment:', error);
      toast.error('Failed to create assignment');
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    const filtered = assignments.filter(assignment =>
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAssignments(filtered);
  }, [searchQuery, assignments]);

  const getStatusVariant = (visible) => {
    return visible ? 'success' : 'secondary';
  };

  const getStatusText = (visible) => {
    return visible ? 'Visible' : 'Hidden';
  };

  if (loading && assignments.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted mt-3">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {}
      <div className="bg-white shadow-sm py-3">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h4 className="fw-bold text-dark mb-0">My Assignments</h4>
            </Col>
            <Col xs="auto">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => navigate(-1)}
                className="me-2"
              >
                <i className="fas fa-arrow-left me-1"></i> Back
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="fas fa-plus me-1"></i> New Assignment
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {}
        <Row className="mb-4">
          <Col lg={8} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                  <i className="fas fa-search text-muted me-2"></i>
                  <Form.Control
                    type="text"
                    placeholder="Search assignments by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-3">
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body className="p-3">
                <h3 className="fw-bold text-primary mb-1">{assignments.length}</h3>
                <small className="text-muted">Total Assignments</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {}
        {filteredAssignments.length > 0 ? (
          <Row>
            {filteredAssignments.map((assignment) => (
              <Col md={6} lg={4} key={assignment.id} className="mb-4">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Badge bg="light" text="dark" className="fw-normal">
                        ID: {assignment.id}
                      </Badge>
                      <Badge bg={getStatusVariant(assignment.visible)}>
                        {getStatusText(assignment.visible)}
                      </Badge>
                    </div>

                    <h6 className="fw-bold text-dark mb-3">{assignment.title}</h6>
                    
                    <div className="mb-3">
                      <small className="text-muted">Description</small>
                      <p className="text-dark small mb-0">
                        {assignment.description || 'No description provided'}
                      </p>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-calendar text-primary me-2"></i>
                        <small className="text-muted">
                          Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}
                        </small>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-graduation-cap text-primary me-2"></i>
                        <small className="text-muted">
                          {assignment.points || '0'} points
                        </small>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => viewStats(assignment)}
                      >
                        <i className="fas fa-chart-bar me-1"></i>
                        View Stats
                      </Button>
                      <div className="d-flex gap-2">
                        <Button
                          variant={assignment.visible ? "outline-warning" : "outline-success"}
                          size="sm"
                          onClick={() => toggleVisibility(assignment)}
                        >
                          <i className={`fas ${assignment.visible ? 'fa-eye-slash' : 'fa-eye'} me-1`}></i>
                          {assignment.visible ? 'Hide' : 'Show'}
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowCreateModal(true);
                          }}
                        >
                          <i className="fas fa-edit me-1"></i>
                          Edit
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Row>
            <Col>
              <Card className="border-0 shadow-sm text-center py-5">
                <Card.Body>
                  <i className="fas fa-tasks fa-3x text-muted mb-3"></i>
                  <h5 className="text-dark mb-2">
                    {searchQuery ? 'No matching assignments found' : 'No assignments created yet'}
                  </h5>
                  <p className="text-muted mb-4">
                    {searchQuery 
                      ? 'Try adjusting your search terms' 
                      : 'Create your first assignment to get started'}
                  </p>
                  {searchQuery ? (
                    <Button variant="outline-primary" onClick={() => setSearchQuery('')}>
                      Clear Search
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                      Create First Assignment
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedAssignment ? 'Edit Assignment' : 'Create New Assignment'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter assignment title"
                value={selectedAssignment ? selectedAssignment.title : newAssignment.title}
                onChange={(e) => selectedAssignment 
                  ? setSelectedAssignment({...selectedAssignment, title: e.target.value})
                  : setNewAssignment({...newAssignment, title: e.target.value})
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter assignment description"
                value={selectedAssignment ? selectedAssignment.description : newAssignment.description}
                onChange={(e) => selectedAssignment 
                  ? setSelectedAssignment({...selectedAssignment, description: e.target.value})
                  : setNewAssignment({...newAssignment, description: e.target.value})
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={selectedAssignment ? selectedAssignment.due_date : newAssignment.due_date}
                onChange={(e) => selectedAssignment 
                  ? setSelectedAssignment({...selectedAssignment, due_date: e.target.value})
                  : setNewAssignment({...newAssignment, due_date: e.target.value})
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter points"
                value={selectedAssignment ? selectedAssignment.points : newAssignment.points}
                onChange={(e) => selectedAssignment 
                  ? setSelectedAssignment({...selectedAssignment, points: e.target.value})
                  : setNewAssignment({...newAssignment, points: e.target.value})
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createAssignment}>
            {selectedAssignment ? 'Update Assignment' : 'Create Assignment'}
          </Button>
        </Modal.Footer>
      </Modal>

      {}
      <Modal show={showStatsModal} onHide={() => setShowStatsModal(false)} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Assignment Statistics: {selectedAssignment?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAssignment?.submissions?.length > 0 ? (
            <>
              <div className="row mb-4">
                <div className="col-md-4">
                  <Card className="border-0 bg-light">
                    <Card.Body className="text-center">
                      <h3 className="fw-bold text-primary">{selectedAssignment.submissions.length}</h3>
                      <small className="text-muted">Total Submissions</small>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-4">
                  <Card className="border-0 bg-light">
                    <Card.Body className="text-center">
                      <h3 className="fw-bold text-success">
                        {selectedAssignment.submissions.filter(s => s.graded).length}
                      </h3>
                      <small className="text-muted">Graded</small>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-4">
                  <Card className="border-0 bg-light">
                    <Card.Body className="text-center">
                      <h3 className="fw-bold text-warning">
                        {selectedAssignment.submissions.filter(s => !s.graded).length}
                      </h3>
                      <small className="text-muted">Pending</small>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Submitted On</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAssignment.submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>{submission.student_name || 'Unknown Student'}</td>
                      <td>
                        <Badge bg={submission.graded ? 'success' : 'warning'}>
                          {submission.graded ? 'Graded' : 'Pending'}
                        </Badge>
                      </td>
                      <td>
                        {submission.submitted_at ? new Date(submission.submitted_at).toLocaleDateString() : 'Not submitted'}
                      </td>
                      <td>
                        {submission.grade || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <div className="text-center py-4">
              <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
              <h5 className="text-dark mb-2">No Submissions Yet</h5>
              <p className="text-muted">Students haven't submitted any work for this assignment yet.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={() => setShowStatsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeacherAssignments;