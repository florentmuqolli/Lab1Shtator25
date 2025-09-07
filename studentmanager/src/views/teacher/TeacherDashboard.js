import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner, Nav, ProgressBar, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [teacherRes, attendanceRes, classRes] = await Promise.all([
        axios.get('/teachers/teacher-stats'),
        axios.get('/attendance/summary/teacher'),
        axios.get('/class/specific-class'),
      ]);

      const teacherData = teacherRes.data;
      const attendanceCourses = attendanceRes.data;
      const specificClass = classRes.data;

      const averageAttendance = attendanceCourses.length > 0
        ? Math.round(attendanceCourses.reduce((acc, curr) => acc + curr.average_attendance_rate, 0) / attendanceCourses.length)
        : 0;

      setStats({
        totalStudents: teacherData.students.total,
        newStudents: teacherData.students.new,
        totalCourses: teacherData.courses.total,
        newCourses: teacherData.courses.new,
        averageAttendance
      });

      
      setUpcomingClasses([
        { id: 1, title: 'Mathematics 101', description: 'Algebra and Calculus', time: '10:00 AM', day: 'Monday', room: 'Room 203' },
        { id: 2, title: 'Advanced Physics', description: 'Quantum Mechanics', time: '2:00 PM', day: 'Tuesday', room: 'Room 105' },
        { id: 3, title: 'Computer Science', description: 'Data Structures', time: '9:00 AM', day: 'Wednesday', room: 'Room 301' }
      ]);

      setLastUpdated(new Date());
      toast.success('Dashboard updated successfully');
    } catch (err) {
      console.error('Failed to fetch teacher stats:', err);
      toast.error('Failed to update dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    setRecentStudents([
      { id: '1', name: 'Alex Johnson', course: 'Mathematics 101', progress: 85 },
      { id: '2', name: 'Maria Garcia', course: 'Advanced Physics', progress: 92 },
      { id: '3', name: 'John Smith', course: 'Computer Science', progress: 78 }
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading && !stats) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted mt-3">Loading your dashboard...</p>
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
              <h4 className="fw-bold text-dark mb-0">Teacher Dashboard</h4>
            </Col>
            <Col xs="auto">
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={fetchStats}
                  disabled={loading}
                  className="me-3"
                >
                  <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'} me-1`}></i>
                  Refresh
                </Button>
                <div className="position-relative">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <i className="fas fa-user me-1"></i>
                    Professor
                  </Button>
                  
                  {showProfileMenu && (
                    <Card className="position-absolute end-0 mt-2 shadow" style={{ zIndex: 1000, minWidth: '200px' }}>
                      <Card.Body className="p-3">
                        <div className="text-center mb-3">
                          <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                               style={{ width: '60px', height: '60px' }}>
                            <i className="fas fa-user-graduate fa-lg text-white"></i>
                          </div>
                          <h6 className="fw-bold mb-0">Professor</h6>
                          <small className="text-muted">Faculty Member</small>
                        </div>
                        <hr />
                        <Button variant="outline-danger" size="sm" className="w-100" onClick={handleLogout}>
                          <i className="fas fa-sign-out-alt me-1"></i>
                          Logout
                        </Button>
                      </Card.Body>
                    </Card>
                  )}
                </div>
              </div>
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
                <Row className="align-items-center">
                  <Col md={8}>
                    <h3 className="fw-bold text-dark mb-2">Welcome, Professor!</h3>
                    <p className="text-muted mb-3">
                      Here's your teaching overview for {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    {elapsedTime && (
                      <small className="text-muted">
                        <i className="fas fa-clock me-1"></i>Last updated {elapsedTime}
                      </small>
                    )}
                  </Col>
                  <Col md={4} className="text-md-end">
                    <div className="bg-primary bg-opacity-10 p-3 rounded d-inline-block">
                      <i className="fas fa-chalkboard-teacher fa-2x text-primary"></i>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {}
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                    <i className="fas fa-user-graduate fa-2x text-success"></i>
                  </div>
                  <div>
                    <h3 className="fw-bold text-dark mb-0">{stats?.totalStudents || 0}</h3>
                    <small className="text-muted">Total Students</small>
                  </div>
                </div>
                <Badge bg="success" className="px-3 py-2">
                  +{stats?.newStudents || 0} New
                </Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                    <i className="fas fa-book fa-2x text-primary"></i>
                  </div>
                  <div>
                    <h3 className="fw-bold text-dark mb-0">{stats?.totalCourses || 0}</h3>
                    <small className="text-muted">Active Courses</small>
                  </div>
                </div>
                <Badge bg="primary" className="px-3 py-2">
                  +{stats?.newCourses || 0} New
                </Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-info bg-opacity-10 p-3 rounded me-3">
                    <i className="fas fa-chart-line fa-2x text-info"></i>
                  </div>
                  <div>
                    <h3 className="fw-bold text-dark mb-0">{stats?.averageAttendance || 0}%</h3>
                    <small className="text-muted">Avg Attendance</small>
                  </div>
                </div>
                <ProgressBar now={stats?.averageAttendance || 0} variant="info" className="mt-2" style={{ height: '8px' }} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-3">
                <Nav variant="pills" className="justify-content-center">
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'overview'} 
                      onClick={() => setActiveTab('overview')}
                      className="mx-2"
                    >
                      <i className="fas fa-home me-2"></i>Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'manage'} 
                      onClick={() => setActiveTab('manage')}
                      className="mx-2"
                    >
                      <i className="fas fa-cog me-2"></i>Manage
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'students'} 
                      onClick={() => setActiveTab('students')}
                      className="mx-2"
                    >
                      <i className="fas fa-users me-2"></i>Students
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {}
        {activeTab === 'overview' && (
          <Row>
            <Col lg={8}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold text-dark mb-0">Upcoming Classes</h5>
                    <Button variant="outline-primary" size="sm">View All</Button>
                  </div>
                  
                  {upcomingClasses.map((classItem) => (
                    <Card key={classItem.id} className="mb-3 border-0 bg-light">
                      <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="fw-bold text-dark mb-1">{classItem.title}</h6>
                            <p className="text-muted small mb-2">{classItem.description}</p>
                            <div className="d-flex align-items-center text-muted small">
                              <i className="fas fa-clock me-2"></i>
                              <span className="me-3">{classItem.time} • {classItem.day}</span>
                              <i className="fas fa-map-marker-alt me-2"></i>
                              <span>{classItem.room}</span>
                            </div>
                          </div>
                          <Button variant="outline-primary" size="sm">
                            View
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h5 className="fw-bold text-dark mb-4">Quick Actions</h5>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary" className="text-start py-3">
                      <i className="fas fa-book me-2"></i>My Courses
                    </Button>
                    <Button variant="outline-primary" className="text-start py-3">
                      <i className="fas fa-tasks me-2"></i>Assignments
                    </Button>
                    <Button variant="outline-primary" className="text-start py-3">
                      <i className="fas fa-chart-line me-2"></i>Grades
                    </Button>
                    <Button variant="outline-primary" className="text-start py-3">
                      <i className="fas fa-users me-2"></i>Students
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {activeTab === 'students' && (
          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold text-dark mb-0">Recent Students</h5>
                    <Button variant="outline-primary" size="sm">View All</Button>
                  </div>
                  
                  {recentStudents.map((student) => (
                    <Card key={student.id} className="mb-3 border-0">
                      <Card.Body className="p-3">
                        <Row className="align-items-center">
                          <Col xs="auto">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                                 style={{ width: '50px', height: '50px' }}>
                              <span className="text-white fw-bold">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </Col>
                          <Col>
                            <h6 className="fw-bold text-dark mb-1">{student.name}</h6>
                            <p className="text-muted small mb-0">{student.course}</p>
                          </Col>
                          <Col xs="auto">
                            <Badge bg="primary">{student.progress}% Progress</Badge>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default TeacherDashboard;