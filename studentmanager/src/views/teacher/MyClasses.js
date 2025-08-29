import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyClasses = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/class/specific-class');
      const coursesWithCounts = await Promise.all(
        res.data.map(async (course) => {
          try {
            const countRes = await axios.get(`/enrollment/total`);
            return {
              ...course,
              totalStudents: countRes.data.totalStudents || 0,
            };
          } catch (err) {
            console.error(`Error fetching student count for class ${course.id}:`, err);
            return { ...course, totalStudents: 0 };
          }
        })
      );
      setCourses(coursesWithCounts);
      setFilteredCourses(coursesWithCounts);
      toast.success('Courses loaded successfully');
    } catch (err) {
      console.error('Error fetching courses:', err);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.room.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const openCourseDetails = (course) => {
    setSelectedCourse(course);
    setShowDetailModal(true);
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'pending': return 'warning';
      case 'completed': return 'primary';
      default: return 'secondary';
    }
  };

  const getDayColor = (day) => {
    const colors = {
      monday: 'primary',
      tuesday: 'info',
      wednesday: 'warning',
      thursday: 'success',
      friday: 'danger',
      saturday: 'secondary',
      sunday: 'dark'
    };
    return colors[day?.toLowerCase()] || 'secondary';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted mt-3">Loading your courses...</p>
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
              <h4 className="fw-bold text-dark mb-0">My Courses</h4>
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
                    placeholder="Search courses by title, description, or room..."
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
                    <h3 className="fw-bold text-primary mb-1">{courses.length}</h3>
                    <small className="text-muted">Total Courses</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body className="p-3">
                    <h3 className="fw-bold text-success mb-1">
                      {courses.reduce((total, course) => total + (course.totalStudents || 0), 0)}
                    </h3>
                    <small className="text-muted">Total Students</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {}
        {filteredCourses.length > 0 ? (
          <Row>
            {filteredCourses.map((course) => (
              <Col md={6} lg={4} key={course.id} className="mb-4">
                <Card 
                  className="border-0 shadow-sm h-100 course-card"
                  onClick={() => openCourseDetails(course)}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Badge bg="light" text="dark" className="fw-normal">
                        ID: {course.id}
                      </Badge>
                      <Badge bg={getStatusVariant(course.status)}>
                        {course.status || 'Unknown'}
                      </Badge>
                    </div>

                    <h6 className="fw-bold text-dark mb-3">{course.title || 'Untitled Course'}</h6>
                    
                    <div className="mb-3">
                      <small className="text-muted">Description</small>
                      <p className="text-dark small mb-0">
                        {course.description || 'No description provided'}
                      </p>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-clock text-primary me-2"></i>
                        <small className="text-muted">{course.schedule || 'Schedule TBA'}</small>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-calendar text-primary me-2"></i>
                        <Badge bg={getDayColor(course.day)}>
                          {course.day || 'Days TBA'}
                        </Badge>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-map-marker-alt text-primary me-2"></i>
                        <small className="text-muted">{course.room || 'Room TBA'}</small>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted d-block">Students Enrolled</small>
                        <span className="fw-semibold">{course.totalStudents || 0}</span>
                      </div>
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
                  <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
                  <h5 className="text-dark mb-2">
                    {searchQuery ? 'No matching courses found' : 'No courses available'}
                  </h5>
                  <p className="text-muted mb-4">
                    {searchQuery 
                      ? 'Try adjusting your search terms' 
                      : 'You haven\'t been assigned to any courses yet'}
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
          {selectedCourse && (
            <>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h4 className="fw-bold text-dark mb-2">{selectedCourse.title}</h4>
                  <div className="d-flex align-items-center gap-3">
                    <Badge bg={getStatusVariant(selectedCourse.status)}>
                      {selectedCourse.status}
                    </Badge>
                    <Badge bg="light" text="dark">
                      ID: {selectedCourse.id}
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
                      <small className="text-muted d-block">Schedule</small>
                      <span className="fw-semibold">{selectedCourse.schedule || 'TBA'}</span>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="p-3">
                      <small className="text-muted d-block">Day</small>
                      <Badge bg={getDayColor(selectedCourse.day)}>
                        {selectedCourse.day || 'TBA'}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="p-3">
                      <small className="text-muted d-block">Room</small>
                      <span className="fw-semibold">{selectedCourse.room || 'TBA'}</span>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="p-3">
                      <small className="text-muted d-block">Students Enrolled</small>
                      <span className="fw-semibold">{selectedCourse.totalStudents || 0}</span>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="mb-4">
                <h6 className="fw-bold text-dark mb-3">Course Description</h6>
                <p className="text-dark">
                  {selectedCourse.description || 'No description provided.'}
                </p>
              </div>

              <div className="text-center">
                <Button variant="primary" className="me-2">
                  <i className="fas fa-users me-2"></i>
                  View Students
                </Button>
                <Button variant="outline-primary">
                  <i className="fas fa-edit me-2"></i>
                  Edit Course
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MyClasses;