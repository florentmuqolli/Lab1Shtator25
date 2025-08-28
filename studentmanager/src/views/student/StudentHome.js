import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardScreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('');
  const [stats, setStats] = useState({
    upcomingClasses: 2,
    pendingAssignments: 3,
    averageGrade: 87.5
  });

  useEffect(() => {
    if (!lastUpdated) return;

    const interval = setInterval(() => {
      const secondsAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      if (secondsAgo < 60) {
        setElapsedTime(`${secondsAgo}s ago`);
      } else {
        const minutes = Math.floor(secondsAgo / 60);
        setElapsedTime(`${minutes}m ago`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/auth/me");
      setName(res.data.name);
      setLastUpdated(new Date());
      toast.success('Dashboard updated successfully');
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to update dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate('/studentprofile');
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !name) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white shadow-sm py-3">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h4 className="fw-bold text-dark mb-0">Dashboard</h4>
            </Col>
            <Col xs="auto">
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={fetchData}
                  disabled={loading}
                  className="me-3"
                >
                  <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'} me-1`}></i>
                  Refresh
                </Button>
                <div 
                  onClick={handleNavigate}
                  className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                  style={{ width: '40px', height: '40px', fontSize: '16px', fontWeight: '600' }}
                >
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col md={8}>
                    <h3 className="fw-bold text-dark mb-2">Welcome back, {name}!</h3>
                    <p className="text-muted mb-3">Here's what's happening with your classes today.</p>
                    {elapsedTime && (
                      <small className="text-muted">
                        <i className="fas fa-clock me-1"></i>Last updated {elapsedTime}
                      </small>
                    )}
                  </Col>
                  <Col md={4} className="text-md-end">
                    <div className="d-inline-block bg-primary bg-opacity-10 p-3 rounded">
                      <i className="fas fa-graduation-cap fa-2x text-primary"></i>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                    <i className="fas fa-calendar-alt text-primary"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold text-dark mb-0">{stats.upcomingClasses}</h5>
                    <small className="text-muted">Upcoming Classes</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
                    <i className="fas fa-tasks text-warning"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold text-dark mb-0">{stats.pendingAssignments}</h5>
                    <small className="text-muted">Pending Assignments</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                    <i className="fas fa-chart-line text-success"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold text-dark mb-0">{stats.averageGrade}%</h5>
                    <small className="text-muted">Average Grade</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={8} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold text-dark mb-0">Today's Classes</h5>
                  <Button variant="outline-primary" size="sm">View All</Button>
                </div>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <Card className="border-0 bg-primary text-white">
                      <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Badge bg="light" text="dark" className="fw-normal">10:00 - 11:30</Badge>
                          <i className="fas fa-calculator"></i>
                        </div>
                        <h6 className="fw-bold mb-1">Mathematics</h6>
                        <small className="opacity-75">Room 203 • Prof. Johnson</small>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="col-md-6">
                    <Card className="border-0 bg-success text-white">
                      <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Badge bg="light" text="dark" className="fw-normal">13:00 - 14:30</Badge>
                          <i className="fas fa-atom"></i>
                        </div>
                        <h6 className="fw-bold mb-1">Physics</h6>
                        <small className="opacity-75">Room 105 • Dr. Smith</small>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold text-dark mb-0">Upcoming Assignments</h5>
                  <Button variant="outline-primary" size="sm">View All</Button>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-info bg-opacity-10 p-2 rounded me-3">
                    <i className="fas fa-calculator text-info"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold text-dark mb-1">Math Homework #2</h6>
                    <small className="text-muted">Due Tomorrow • 10 pts</small>
                    <ProgressBar now={0} variant="warning" className="mt-1" style={{ height: '4px' }} />
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                    <i className="fas fa-book text-primary"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold text-dark mb-1">Literature Essay</h6>
                    <small className="text-muted">Due in 3 days • 15 pts</small>
                    <ProgressBar now={30} variant="primary" className="mt-1" style={{ height: '4px' }} />
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                    <i className="fas fa-flask text-success"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold text-dark mb-1">Lab Report</h6>
                    <small className="text-muted">Due in 5 days • 20 pts</small>
                    <ProgressBar now={60} variant="success" className="mt-1" style={{ height: '4px' }} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="fw-bold text-dark mb-4">Quick Actions</h5>
                <Row className="g-3">
                  <Col md={3} sm={6}>
                    <Button variant="outline-primary" className="w-100 py-3 d-flex flex-column align-items-center">
                      <i className="fas fa-calendar-alt fa-2x mb-2"></i>
                      <span>Schedule</span>
                    </Button>
                  </Col>
                  <Col md={3} sm={6}>
                    <Button variant="outline-primary" className="w-100 py-3 d-flex flex-column align-items-center">
                      <i className="fas fa-tasks fa-2x mb-2"></i>
                      <span>Assignments</span>
                    </Button>
                  </Col>
                  <Col md={3} sm={6}>
                    <Button variant="outline-primary" className="w-100 py-3 d-flex flex-column align-items-center">
                      <i className="fas fa-chart-line fa-2x mb-2"></i>
                      <span>Grades</span>
                    </Button>
                  </Col>
                  <Col md={3} sm={6}>
                    <Button variant="outline-primary" className="w-100 py-3 d-flex flex-column align-items-center">
                      <i className="fas fa-book fa-2x mb-2"></i>
                      <span>Resources</span>
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardScreen;