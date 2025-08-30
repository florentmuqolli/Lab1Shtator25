import React from 'react';
import { Modal, Button, Card, Row, Col, Badge, Table, Spinner } from 'react-bootstrap';

const AssignmentStatsModal = ({ visible, onClose, assignment, loading }) => {
  const calculateStats = () => {
    if (!assignment?.submissions) return {};
    
    const totalSubmissions = assignment.submissions.length;
    const gradedSubmissions = assignment.submissions.filter(sub => sub.grade !== null).length;
    const averageGrade = totalSubmissions > 0 
      ? (assignment.submissions.reduce((sum, sub) => sum + (parseFloat(sub.grade) || 0), 0) / totalSubmissions).toFixed(1)
      : 0;
    
    return { totalSubmissions, gradedSubmissions, averageGrade };
  };

  const stats = calculateStats();

  const getGradeColor = (grade) => {
    if (!grade) return 'secondary';
    const numericGrade = parseFloat(grade);
    if (numericGrade >= 90) return 'success';
    if (numericGrade >= 80) return 'primary';
    if (numericGrade >= 70) return 'warning';
    return 'danger';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not submitted';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Modal show={visible} onHide={onClose} centered size="xl">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-dark">
          {assignment?.title} - Submission Statistics
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {}
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm text-center">
              <Card.Body className="p-3">
                <h3 className="fw-bold text-primary mb-1">{stats.totalSubmissions || 0}</h3>
                <small className="text-muted">Total Submissions</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm text-center">
              <Card.Body className="p-3">
                <h3 className="fw-bold text-success mb-1">{stats.gradedSubmissions || 0}</h3>
                <small className="text-muted">Graded</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm text-center">
              <Card.Body className="p-3">
                <h3 className="fw-bold text-info mb-1">{stats.averageGrade || 0}</h3>
                <small className="text-muted">Average Grade</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <div className="p-3 border-bottom">
              <h6 className="fw-bold text-dark mb-0">Student Submissions</h6>
            </div>
            
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-2">Loading submissions...</p>
              </div>
            ) : assignment?.submissions?.length > 0 ? (
              <div className="table-responsive">
                <Table striped hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Submitted At</th>
                      <th>Status</th>
                      <th>Grade</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignment.submissions.map((submission, index) => (
                      <tr key={index}>
                        <td className="fw-semibold">{submission.student_id}</td>
                        <td>{submission.student_name || 'Unknown Student'}</td>
                        <td>
                          <small className="text-muted">
                            {formatDate(submission.submitted_at)}
                          </small>
                        </td>
                        <td>
                          <Badge bg={submission.grade !== null ? 'success' : 'warning'}>
                            {submission.grade !== null ? 'Graded' : 'Pending'}
                          </Badge>
                        </td>
                        <td>
                          {submission.grade !== null ? (
                            <Badge bg={getGradeColor(submission.grade)} className="px-3 py-2">
                              {submission.grade}
                            </Badge>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm">
                            <i className="fas fa-eye me-1"></i>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                <h6 className="text-dark mb-2">No Submissions Yet</h6>
                <p className="text-muted">Students haven't submitted any work for this assignment.</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {}
        {assignment?.submissions?.length > 0 && (
          <Row className="mt-4">
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h6 className="fw-bold text-dark mb-3">Grade Distribution</h6>
                  <div className="d-flex align-items-center mb-2">
                    <div className="flex-grow-1">
                      <small className="text-muted">A (90-100)</small>
                    </div>
                    <Badge bg="success">
                      {assignment.submissions.filter(sub => sub.grade >= 90).length}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <div className="flex-grow-1">
                      <small className="text-muted">B (80-89)</small>
                    </div>
                    <Badge bg="primary">
                      {assignment.submissions.filter(sub => sub.grade >= 80 && sub.grade < 90).length}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <div className="flex-grow-1">
                      <small className="text-muted">C (70-79)</small>
                    </div>
                    <Badge bg="warning">
                      {assignment.submissions.filter(sub => sub.grade >= 70 && sub.grade < 80).length}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <small className="text-muted">Below 70</small>
                    </div>
                    <Badge bg="danger">
                      {assignment.submissions.filter(sub => sub.grade < 70).length}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h6 className="fw-bold text-dark mb-3">Submission Timeline</h6>
                  <div className="d-flex align-items-center mb-2">
                    <div className="flex-grow-1">
                      <small className="text-muted">On Time</small>
                    </div>
                    <Badge bg="success">
                      {assignment.submissions.filter(sub => {
                       
                        return true; 
                      }).length}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <small className="text-muted">Late</small>
                    </div>
                    <Badge bg="danger">
                      {assignment.submissions.filter(sub => {
                        
                        return false; 
                      }).length}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0">
        <Button variant="outline-secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary">
          <i className="fas fa-download me-1"></i>
          Export Data
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignmentStatsModal;