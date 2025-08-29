import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner, Dropdown, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Assignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get("/assignment");
        setAssignments(response.data);
        setFilteredAssignments(response.data);
        toast.success('Assignments loaded successfully');
      } catch (err) {
        setError("Failed to load assignments.");
        console.error(err);
        toast.error('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  useEffect(() => {
    let filtered = [...assignments];
    
    
    if (filter !== "all") {
      filtered = filtered.filter(assignment => assignment.status === filter);
    }
    
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.due_date) - new Date(b.due_date);
        case "priority":
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case "course":
          return (a.class_id || '').localeCompare(b.class_id || '');
        default:
          return 0;
      }
    });
    
    setFilteredAssignments(filtered);
  }, [assignments, filter, sortBy]);

  const openAssignmentDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailModal(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'primary';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return 'No due date';
    
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    
    return date.toLocaleDateString();
  };

  const getCourseInitial = (courseName) => {
    return courseName ? courseName.charAt(0).toUpperCase() : '?';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted mt-3">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
          <h5 className="text-dark mb-3">Failed to load assignments</h5>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
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
              <h4 className="fw-bold text-dark mb-0">Assignments</h4>
            </Col>
            <Col xs="auto">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => navigate(-1)}
              >
                <i className="fas fa-arrow-left me-1"></i> Back
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="fw-bold text-dark mb-1">Assignment Overview</h5>
                    <p className="text-muted mb-0">
                      {filteredAssignments.length} of {assignments.length} assignments
                    </p>
                  </div>
                  <Badge bg="primary" className="px-3 py-2">
                    <i className="fas fa-tasks me-2"></i>
                    {assignments.length} Total
                  </Badge>
                </div>

                <div className="row g-3">
                  <div className="col-md-6 col-lg-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                        <i className="fas fa-filter text-primary"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Filter by</small>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-primary" size="sm" className="w-100 text-start">
                            {filter === 'all' ? 'All Assignments' : filter}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setFilter('all')}>All Assignments</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter('pending')}>Pending</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter('in progress')}>In Progress</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter('completed')}>Completed</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilter('overdue')}>Overdue</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                        <i className="fas fa-sort text-success"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Sort by</small>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-primary" size="sm" className="w-100 text-start">
                            {sortBy === 'dueDate' ? 'Due Date' : 
                             sortBy === 'priority' ? 'Priority' : 'Course'}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setSortBy('dueDate')}>Due Date</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortBy('priority')}>Priority</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSortBy('course')}>Course</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <Card className="border-0 bg-primary bg-opacity-10 h-100">
                      <Card.Body className="p-3 text-center">
                        <h6 className="fw-bold text-primary mb-1">
                          {assignments.filter(a => a.status === 'pending').length}
                        </h6>
                        <small className="text-muted">Pending</small>
                      </Card.Body>
                    </Card>
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <Card className="border-0 bg-warning bg-opacity-10 h-100">
                      <Card.Body className="p-3 text-center">
                        <h6 className="fw-bold text-warning mb-1">
                          {assignments.filter(a => a.status === 'overdue').length}
                        </h6>
                        <small className="text-muted">Overdue</small>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {}
        {filteredAssignments.length > 0 ? (
          <Row>
            {filteredAssignments.map((assignment) => (
              <Col md={6} lg={4} key={assignment.id} className="mb-4">
                <Card 
                  className="border-0 shadow-sm h-100 assignment-card"
                  onClick={() => openAssignmentDetails(assignment)}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        <div 
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: '40px', height: '40px', fontSize: '16px', fontWeight: 'bold' }}
                        >
                          {getCourseInitial(assignment.class_id)}
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark mb-0">{assignment.class_id || 'Unknown Course'}</h6>
                          <small className="text-muted">{formatDueDate(assignment.due_date)}</small>
                        </div>
                      </div>
                      <Badge bg={getPriorityColor(assignment.priority)}>
                        {assignment.priority || 'No Priority'}
                      </Badge>
                    </div>

                    <h6 className="fw-bold text-dark mb-3">{assignment.title || 'Untitled Assignment'}</h6>
                    
                    <div className="mb-3">
                      <small className="text-muted">Description</small>
                      <p className="text-dark small mb-0">
                        {assignment.description || 'No description provided'}
                      </p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg={getStatusColor(assignment.status)}>
                        {assignment.status || 'Unknown Status'}
                      </Badge>
                      <Button variant="outline-primary" size="sm">
                        View Details
                      </Button>
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
                  <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                  <h5 className="text-dark mb-2">No Assignments Found</h5>
                  <p className="text-muted mb-4">
                    {filter === 'all' 
                      ? "You don't have any assignments yet." 
                      : `No assignments match the "${filter}" filter.`}
                  </p>
                  {filter !== 'all' && (
                    <Button variant="outline-primary" onClick={() => setFilter('all')}>
                      Show All Assignments
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="lg">
        <Modal.Body className="p-4">
          {selectedAssignment && (
            <>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h4 className="fw-bold text-dark mb-2">{selectedAssignment.title}</h4>
                  <div className="d-flex align-items-center gap-3">
                    <Badge bg={getStatusColor(selectedAssignment.status)}>
                      {selectedAssignment.status}
                    </Badge>
                    <Badge bg={getPriorityColor(selectedAssignment.priority)}>
                      {selectedAssignment.priority} Priority
                    </Badge>
                  </div>
                </div>
                <Button variant="outline-secondary" size="sm" onClick={() => setShowDetailModal(false)}>
                  <i className="fas fa-times"></i>
                </Button>
              </div>

              <Row className="g-3 mb-4">
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="p-3">
                      <small className="text-muted d-block">Course</small>
                      <span className="fw-semibold">{selectedAssignment.class_id || 'Unknown'}</span>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="p-3">
                      <small className="text-muted d-block">Due Date</small>
                      <span className="fw-semibold">{formatDueDate(selectedAssignment.due_date)}</span>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-3">Assignment Details</h6>
                <p className="text-dark">
                  {selectedAssignment.description || 'No description provided.'}
                </p>
              </div>

              <div className="text-center">
                <Button variant="primary" className="me-2">
                  <i className="fas fa-edit me-2"></i>
                  Edit Assignment
                </Button>
                <Button variant="outline-primary">
                  <i className="fas fa-download me-2"></i>
                  Download Materials
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Assignments;