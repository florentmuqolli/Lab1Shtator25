import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Modal, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/auth/me');
        const userData = response.data;
        setUser(userData);
        toast.success('Profile loaded successfully');
      } catch (error) {
        console.error('Error fetching user data: ', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted mt-3">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <i className="fas fa-user-slash fa-3x text-muted mb-3"></i>
          <p className="text-muted">User not found.</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="bg-white shadow-sm py-3">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h4 className="fw-bold text-dark mb-0">Profile</h4>
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
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body className="p-5">
                <div className="mb-4">
                  <div 
                    className="mx-auto d-flex align-items-center justify-content-center bg-primary text-white rounded-circle"
                    style={{ width: '120px', height: '120px', fontSize: '48px', fontWeight: '600' }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                <h3 className="fw-bold text-dark mb-2">{user.name}</h3>
                <p className="text-muted mb-3">{user.email}</p>
                <Badge bg="primary" className="px-3 py-2">
                  <i className="fas fa-user-graduate me-2"></i>
                  {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'}
                </Badge>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <h6 className="fw-bold text-dark mb-4">
                  <i className="fas fa-id-card text-primary me-2"></i>
                  Personal Information
                </h6>
                <div className="mb-3">
                  <small className="text-muted">Student ID</small>
                  <p className="fw-semibold text-dark mb-0">{user.studentId || 'N/A'}</p>
                </div>
                <div className="mb-3">
                  <small className="text-muted">Status</small>
                  <p className="fw-semibold text-dark mb-0">{user.studentStatus || 'Active'}</p>
                </div>
                <div>
                  <small className="text-muted">Member Since</small>
                  <p className="fw-semibold text-dark mb-0">{new Date().getFullYear()}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <h6 className="fw-bold text-dark mb-4">
                  <i className="fas fa-chart-bar text-primary me-2"></i>
                  Academic Summary
                </h6>
                <div className="mb-3">
                  <small className="text-muted">Current GPA</small>
                  <p className="fw-semibold text-dark mb-0">3.75 / 4.0</p>
                </div>
                <div className="mb-3">
                  <small className="text-muted">Enrolled Courses</small>
                  <p className="fw-semibold text-dark mb-0">5 Courses</p>
                </div>
                <div>
                  <small className="text-muted">Attendance Rate</small>
                  <p className="fw-semibold text-dark mb-0">94%</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h6 className="fw-bold text-dark mb-4">Account Settings</h6>
                
                <div className="list-group list-group-flush">
                  <Button 
                    variant="outline-light" 
                    className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 border-0"
                    onClick={() => navigate('/coming-soon')}
                  >
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                        <i className="fas fa-cog text-primary"></i>
                      </div>
                      <span className="fw-semibold">Settings</span>
                    </div>
                    <i className="fas fa-chevron-right text-muted"></i>
                  </Button>

                  <Button 
                    variant="outline-light" 
                    className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 border-0"
                    onClick={() => navigate('/coming-soon')}
                  >
                    <div className="d-flex align-items-center">
                      <div className="bg-info bg-opacity-10 p-2 rounded me-3">
                        <i className="fas fa-question-circle text-info"></i>
                      </div>
                      <span className="fw-semibold">Help & Support</span>
                    </div>
                    <i className="fas fa-chevron-right text-muted"></i>
                  </Button>

                  <Button 
                    variant="outline-light" 
                    className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 border-0"
                    onClick={() => navigate('/coming-soon')}
                  >
                    <div className="d-flex align-items-center">
                      <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                        <i className="fas fa-info-circle text-success"></i>
                      </div>
                      <span className="fw-semibold">About</span>
                    </div>
                    <i className="fas fa-chevron-right text-muted"></i>
                  </Button>

                  <Button 
                    variant="outline-light" 
                    className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-3 border-0 text-danger"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <div className="d-flex align-items-center">
                      <div className="bg-danger bg-opacity-10 p-2 rounded me-3">
                        <i className="fas fa-sign-out-alt text-danger"></i>
                      </div>
                      <span className="fw-semibold">Logout</span>
                    </div>
                    <i className="fas fa-chevron-right text-muted"></i>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Body className="p-4 text-center">
          <div className="bg-danger bg-opacity-10 p-3 rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
            <i className="fas fa-sign-out-alt fa-2x text-danger"></i>
          </div>
          <h5 className="fw-bold text-dark mb-3">Confirm Logout</h5>
          <p className="text-muted mb-4">Are you sure you want to logout from your account?</p>
          <div className="d-flex gap-3 justify-content-center">
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowLogoutModal(false)}
              className="px-4"
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleLogout}
              className="px-4"
            >
              Logout
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProfilePage;