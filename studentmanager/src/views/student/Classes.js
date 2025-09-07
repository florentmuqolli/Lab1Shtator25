import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Classes = () => {
  const navigate = useNavigate();
  const [myClasses, setMyClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const fetchStudentId = async () => {
    try {
      const res = await axios.get('/auth/me');
      setStudentId(res.data.studentId);  
    } catch (err) {
      console.error('Error fetching student info:', err);
      toast.error('Failed to load student information');
    }
  };

  const fetchMyClasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/students/specific-class');
      setMyClasses(res.data);
      setEnrolledIds(res.data.map(cls => cls.id));
      toast.success('Your classes loaded successfully');
    } catch (err) {
      console.error('Error fetching my classes:', err);
      toast.error('Failed to load your classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllClasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/class');
      setAllClasses(res.data);
      toast.success('All classes loaded successfully');
    } catch (err) {
      console.error('Error fetching all classes:', err);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (classId) => {
    if (!studentId) {
      toast.error('Student ID not loaded yet');
      return;
    }

    try {
      await axios.post(`/enrollment`, {
        student_id: studentId,
        class_id: classId
      });

      setEnrolledIds([...enrolledIds, classId]);
      const enrolledClass = allClasses.find(cls => cls.id === classId);
      
      if (enrolledClass && !myClasses.some(cls => cls.id === classId)) {
        setMyClasses([...myClasses, enrolledClass]);
      }

      setShowEnrollModal(false);
      toast.success('Successfully enrolled in class!');
    } catch (err) {
      console.error('Error enrolling in class:', err);
      toast.error('Failed to enroll in class');
    }
  };

  const openEnrollModal = (classItem) => {
    setSelectedClass(classItem);
    setShowEnrollModal(true);
  };

  useEffect(() => {
    fetchMyClasses();
    fetchStudentId();
  }, []);

  const currentData = showAllClasses ? allClasses : myClasses;

  const getRandomColor = (index) => {
    const colors = [
      'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
      'linear-gradient(135deg, #00B894 0%, #00806a 100%)',
      'linear-gradient(135deg, #FD79A8 0%, #e84393 100%)',
      'linear-gradient(135deg, #FDCB6E 0%, #e17055 100%)',
      'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)',
      'linear-gradient(135deg, #00CEC9 0%, #0984e3 100%)'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-light min-vh-100">
      {}
      <div className="bg-white shadow-sm py-3">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h4 className="fw-bold text-dark mb-0">Classes</h4>
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
                  <h5 className="fw-bold text-dark mb-0">
                    {showAllClasses ? "All Available Classes" : "My Enrolled Classes"}
                  </h5>
                  <Badge bg="primary" className="px-3 py-2">
                    {currentData.length} {currentData.length === 1 ? 'Class' : 'Classes'}
                  </Badge>
                </div>

                <div className="d-flex gap-2">
                  <Button
                    variant={!showAllClasses ? "primary" : "outline-primary"}
                    onClick={() => setShowAllClasses(false)}
                    className="flex-grow-1"
                  >
                    <i className="fas fa-user-graduate me-2"></i>
                    My Classes
                  </Button>
                  <Button
                    variant={showAllClasses ? "primary" : "outline-primary"}
                    onClick={() => {
                      setShowAllClasses(true);
                      if (allClasses.length === 0) fetchAllClasses();
                    }}
                    className="flex-grow-1"
                  >
                    <i className="fas fa-book me-2"></i>
                    All Classes
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {loading ? (
          <Row>
            <Col className="text-center py-5">
              <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
              <p className="text-muted mt-3">Loading classes...</p>
            </Col>
          </Row>
        ) : (
          <Row>
            {currentData.length === 0 ? (
              <Col>
                <Card className="border-0 shadow-sm text-center py-5">
                  <Card.Body>
                    <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
                    <h5 className="text-dark mb-2">No Classes Available</h5>
                    <p className="text-muted">
                      {showAllClasses 
                        ? "There are currently no classes available for enrollment." 
                        : "You haven't enrolled in any classes yet."}
                    </p>
                    {!showAllClasses && (
                      <Button 
                        variant="primary" 
                        onClick={() => setShowAllClasses(true)}
                      >
                        Browse Available Classes
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              currentData.map((classItem, index) => (
                <Col md={6} lg={4} key={classItem.id} className="mb-4">
                  <Card className="border-0 shadow-sm h-100">
                    <div 
                      className="class-header"
                      style={{ 
                        background: getRandomColor(index),
                        height: '120px',
                        position: 'relative'
                      }}
                    >
                      <div className="position-absolute top-0 start-0 p-3">
                        <Badge bg="light" text="dark" className="fw-normal">
                          {classItem.code || `CLS-${classItem.id}`}
                        </Badge>
                      </div>
                    </div>
                    <Card.Body className="p-4">
                      <h6 className="fw-bold text-dark mb-2">{classItem.title}</h6>
                      <p className="text-muted small mb-3">by {classItem.teacher_name || 'Professor'}</p>
                      
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-clock text-primary me-2"></i>
                          <small className="text-muted">{classItem.schedule || 'Schedule TBA'}</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-calendar text-primary me-2"></i>
                          <small className="text-muted">{classItem.day || 'Days TBA'}</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-map-marker-alt text-primary me-2"></i>
                          <small className="text-muted">{classItem.room || 'Room TBA'}</small>
                        </div>
                      </div>

                      {showAllClasses && (
                        <Button
                          variant={enrolledIds.includes(classItem.id) ? "outline-secondary" : "primary"}
                          className="w-100"
                          disabled={enrolledIds.includes(classItem.id)}
                          onClick={() => openEnrollModal(classItem)}
                        >
                          {enrolledIds.includes(classItem.id) ? (
                            <>
                              <i className="fas fa-check me-2"></i>
                              Enrolled
                            </>
                          ) : (
                            <>
                              <i className="fas fa-plus me-2"></i>
                              Enroll Now
                            </>
                          )}
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        )}
      </Container>

      {}
      <Modal show={showEnrollModal} onHide={() => setShowEnrollModal(false)} centered>
        <Modal.Body className="p-4">
          <div className="text-center mb-4">
            <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
              <i className="fas fa-book-open fa-2x text-primary"></i>
            </div>
            <h5 className="fw-bold text-dark mb-2">Confirm Enrollment</h5>
            <p className="text-muted">
              Are you sure you want to enroll in <strong>{selectedClass?.title}</strong>?
            </p>
          </div>
          
          {selectedClass && (
            <div className="bg-light p-3 rounded mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Instructor:</span>
                <strong>{selectedClass.teacher_name}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Schedule:</span>
                <strong>{selectedClass.schedule}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Location:</span>
                <strong>{selectedClass.room}</strong>
              </div>
            </div>
          )}

          <div className="d-flex gap-3">
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowEnrollModal(false)}
              className="flex-grow-1"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={() => handleEnroll(selectedClass?.id)}
              className="flex-grow-1"
            >
              Confirm Enrollment
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Classes;