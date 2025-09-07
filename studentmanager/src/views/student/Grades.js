import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Grades = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/grades/my'); 
      setGrades(res.data);
      toast.success('Grades loaded successfully');
    } catch (err) {
      console.error('Error fetching grades:', err);
      toast.error('Failed to fetch grades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const filteredGrades = grades.filter(grade =>
    grade.class_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const averageGrade = grades.length > 0 ? 
    (grades.reduce((sum, grade) => sum + parseFloat(grade.grade || 0), 0) / grades.length).toFixed(1) : 0;

  const openGradeDetails = (grade) => {
    setSelectedGrade(grade);
    setShowDetailModal(true);
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'secondary';
    const numericGrade = parseFloat(grade);
    if (numericGrade >= 90) return 'success';
    if (numericGrade >= 80) return 'primary';
    if (numericGrade >= 70) return 'warning';
    return 'danger';
  };

  const getGradeIcon = (grade) => {
    if (!grade) return 'fa-question-circle';
    const numericGrade = parseFloat(grade);
    if (numericGrade >= 90) return 'fa-trophy';
    if (numericGrade >= 80) return 'fa-star';
    if (numericGrade >= 70) return 'fa-check-circle';
    return 'fa-exclamation-circle';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted mt-3">Loading your grades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {}
      <div className="bg-white shadow-sm py-3">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h4 className="fw-bold text-dark mb-0">Grades Overview</h4>
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
          <Col lg={8} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                  <i className="fas fa-search text-muted me-2"></i>
                  <Form.Control
                    type="text"
                    placeholder="Search grades by class name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-3">
            <Row className="g-3">
              <Col xs={6}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body className="p-3">
                    <h3 className="fw-bold text-primary mb-1">{grades.length}</h3>
                    <small className="text-muted">Total Grades</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body className="p-3">
                    <h3 className="fw-bold text-success mb-1">{averageGrade}</h3>
                    <small className="text-muted">Average</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {}
        {filteredGrades.length > 0 ? (
          <Row>
            {filteredGrades.map((grade) => (
              <Col md={6} lg={4} key={grade.id} className="mb-4">
                <Card 
                  className="border-0 shadow-sm h-100 grade-card"
                  onClick={() => openGradeDetails(grade)}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Badge bg="light" text="dark" className="fw-normal">
                        {grade.code || `GRD-${grade.id}`}
                      </Badge>
                      <div className={`bg-${getGradeColor(grade.grade)} bg-opacity-10 p-2 rounded`}>
                        <i className={`fas ${getGradeIcon(grade.grade)} text-${getGradeColor(grade.grade)}`}></i>
                      </div>
                    </div>

                    <h6 className="fw-bold text-dark mb-2">{grade.class_title || 'No Class Title'}</h6>
                    <p className="text-muted small mb-3">Coursework Assessment</p>

                    <div className="text-center mb-3">
                      <div className={`display-4 fw-bold text-${getGradeColor(grade.grade)}`}>
                        {grade.grade || 'N/A'}
                      </div>
                      <small className="text-muted">Current Grade</small>
                    </div>

                    <div className="border-top pt-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">Graded on:</small>
                        <small className="fw-semibold">
                          {grade.graded_at ? new Date(grade.graded_at).toLocaleDateString() : 'N/A'}
                        </small>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Student ID:</small>
                        <small className="fw-semibold">{grade.student_id || 'N/A'}</small>
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
                  <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                  <h5 className="text-dark mb-2">
                    {searchQuery ? 'No matching grades found' : 'No grades available'}
                  </h5>
                  <p className="text-muted mb-4">
                    {searchQuery 
                      ? 'Try adjusting your search terms' 
                      : 'Your grades will appear here once they are published'}
                  </p>
                  {searchQuery && (
                    <Button variant="outline-primary" onClick={() => setSearchQuery('')}>
                      Clear Search
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
          {selectedGrade && (
            <>
              <div className="text-center mb-4">
                <div className={`bg-${getGradeColor(selectedGrade.grade)} bg-opacity-10 p-3 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}>
                  <i className={`fas ${getGradeIcon(selectedGrade.grade)} fa-2x text-${getGradeColor(selectedGrade.grade)}`}></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">{selectedGrade.class_title}</h4>
                <Badge bg={getGradeColor(selectedGrade.grade)} className="px-3 py-2 mb-3">
                  Grade: {selectedGrade.grade || 'N/A'}
                </Badge>
              </div>

              <Row className="g-3 mb-4">
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="p-3">
                      <small className="text-muted d-block">Course Code</small>
                      <span className="fw-semibold">{selectedGrade.code || 'N/A'}</span>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="p-3">
                      <small className="text-muted d-block">Student ID</small>
                      <span className="fw-semibold">{selectedGrade.student_id || 'N/A'}</span>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="p-3">
                      <small className="text-muted d-block">Graded Date</small>
                      <span className="fw-semibold">
                        {selectedGrade.graded_at ? new Date(selectedGrade.graded_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="p-3">
                      <small className="text-muted d-block">Status</small>
                      <span className="fw-semibold">Published</span>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="text-center">
                <Button variant="outline-primary" onClick={() => setShowDetailModal(false)}>
                  Close Details
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Grades;