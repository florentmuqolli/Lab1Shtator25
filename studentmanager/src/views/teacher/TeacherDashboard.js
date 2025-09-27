import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner, Nav, ProgressBar, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/TeacherDashboard.css"; 

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
        axiosInstance.get('/teacher/teacher-stats'),
        axiosInstance.get('/attendance/summary/teacher'),
        axiosInstance.get('/class/specific-class'),
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
      
      setUpcomingClasses(
        specificClass.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          time: c.schedule,
          day: c.day,
          room: c.room
        }))
      );

      setLastUpdated(new Date());
      toast.success('Dashboard updated successfully');
    } catch (err) {
      console.error('Failed to fetch teacher stats:', err);
      toast.error('Failed to update dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledStudents = async (teacherId) => {
    try {
      const classRes = await axiosInstance.get(`/class/teacher/${teacherId}`);
      const classes = classRes.data;

      const studentPromises = classes.map((c) =>
        axiosInstance.get(`/enrollments/${c.id}/students`)
      );
      const studentResponses = await Promise.all(studentPromises);
      const allStudents = [];
      const studentMap = new Map();

      studentResponses.forEach((res) => {
        res.data.forEach((s) => {
          if (!studentMap.has(s.id)) {
            studentMap.set(s.id, { id: s.id, name: s.name || `Student ${s.id}` });
          }
        });
      });

      setRecentStudents(Array.from(studentMap.values()));
    } catch (err) {
      console.error('Failed to fetch enrolled students:', err);
      toast.error('Unable to load enrolled students');
    }
  };


  useEffect(() => {
    const teacherId = 1; 
    fetchStats();
    fetchEnrolledStudents(teacherId);
  }, []);



  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading && !stats) {
    return (
      <div className="teacher-dashboard-loading">
        <div className="teacher-dashboard-spinner-container">
          <Spinner animation="border" variant="primary" className="teacher-dashboard-spinner" />
          <p className="teacher-dashboard-loading-text">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard-container">
      <div className="teacher-dashboard-header">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h4 className="teacher-dashboard-title">Teacher Dashboard</h4>
            </Col>
            <Col xs="auto">
              <div className="teacher-dashboard-header-actions">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={fetchStats}
                  disabled={loading}
                  className="teacher-dashboard-refresh-btn"
                >
                  <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'} me-1`}></i>
                  Refresh
                </Button>
                <div className="teacher-dashboard-profile-container">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="teacher-dashboard-profile-btn"
                  >
                    <i className="fas fa-user me-1"></i>
                    Professor
                  </Button>
                  
                  {showProfileMenu && (
                    <Card className="teacher-dashboard-profile-menu">
                      <Card.Body className="teacher-dashboard-profile-menu-body">
                        <div className="teacher-dashboard-profile-info">
                          <div className="teacher-dashboard-profile-avatar">
                            <i className="fas fa-user-graduate"></i>
                          </div>
                          <h6 className="teacher-dashboard-profile-name">Professor</h6>
                          <small className="teacher-dashboard-profile-role">Faculty Member</small>
                        </div>
                        <hr className="teacher-dashboard-profile-divider" />
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          className="teacher-dashboard-logout-btn"
                          onClick={handleLogout}
                        >
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

      <Container className="teacher-dashboard-content">
        <Row className="mb-4">
          <Col>
            <Card className="teacher-dashboard-welcome-card">
              <Card.Body className="teacher-dashboard-welcome-body">
                <Row className="align-items-center">
                  <Col md={8}>
                    <h3 className="teacher-dashboard-welcome-title">Welcome, Professor!</h3>
                    <p className="teacher-dashboard-welcome-text">
                      Here's your teaching overview for {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    {elapsedTime && (
                      <small className="teacher-dashboard-update-time">
                        <i className="fas fa-clock me-1"></i>Last updated {elapsedTime}
                      </small>
                    )}
                  </Col>
                  <Col md={4} className="text-md-end">
                    <div className="teacher-dashboard-welcome-icon">
                      <i className="fas fa-chalkboard-teacher"></i>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card className="teacher-dashboard-stat-card teacher-dashboard-stat-students">
              <Card.Body className="teacher-dashboard-stat-body">
                <div className="teacher-dashboard-stat-content">
                  <div className="teacher-dashboard-stat-icon">
                    <i className="fas fa-user-graduate"></i>
                  </div>
                  <div>
                    <h3 className="teacher-dashboard-stat-value">{stats?.totalStudents || 0}</h3>
                    <small className="teacher-dashboard-stat-label">Total Students</small>
                  </div>
                </div>
                <Badge className="teacher-dashboard-stat-badge teacher-dashboard-stat-badge-students">
                  +{stats?.newStudents || 0} New
                </Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="teacher-dashboard-stat-card teacher-dashboard-stat-courses">
              <Card.Body className="teacher-dashboard-stat-body">
                <div className="teacher-dashboard-stat-content">
                  <div className="teacher-dashboard-stat-icon">
                    <i className="fas fa-book"></i>
                  </div>
                  <div>
                    <h3 className="teacher-dashboard-stat-value">{stats?.totalCourses || 0}</h3>
                    <small className="teacher-dashboard-stat-label">Active Courses</small>
                  </div>
                </div>
                <Badge className="teacher-dashboard-stat-badge teacher-dashboard-stat-badge-courses">
                  +{stats?.newCourses || 0} New
                </Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="teacher-dashboard-stat-card teacher-dashboard-stat-attendance">
              <Card.Body className="teacher-dashboard-stat-body">
                <div className="teacher-dashboard-stat-content">
                  <div className="teacher-dashboard-stat-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div>
                    <h3 className="teacher-dashboard-stat-value">{stats?.averageAttendance || 0}%</h3>
                    <small className="teacher-dashboard-stat-label">Avg Attendance</small>
                  </div>
                </div>
                <ProgressBar 
                  now={stats?.averageAttendance || 0} 
                  className="teacher-dashboard-attendance-progress" 
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Card className="teacher-dashboard-tabs-card">
              <Card.Body className="teacher-dashboard-tabs-body">
                <Nav className="teacher-dashboard-tabs">
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'overview'} 
                      onClick={() => setActiveTab('overview')}
                      className="teacher-dashboard-tab"
                    >
                      <i className="fas fa-home me-2"></i>Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'manage'} 
                      onClick={() => setActiveTab('manage')}
                      className="teacher-dashboard-tab"
                    >
                      <i className="fas fa-cog me-2"></i>Manage
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'students'} 
                      onClick={() => setActiveTab('students')}
                      className="teacher-dashboard-tab"
                    >
                      <i className="fas fa-users me-2"></i>Students
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {activeTab === 'overview' && (
          <Row>
            <Col lg={8}>
              <Card className="teacher-dashboard-section-card">
                <Card.Body className="teacher-dashboard-section-body">
                  <div className="teacher-dashboard-section-header">
                    <h5 className="teacher-dashboard-section-title">Upcoming Classes</h5>
                    <Button variant="outline-primary" size="sm" className="teacher-dashboard-view-all-btn">View All</Button>
                  </div>
                  
                  {upcomingClasses.map((classItem) => (
                    <Card key={classItem.id} className="teacher-dashboard-class-card">
                      <Card.Body className="teacher-dashboard-class-body">
                        <div className="teacher-dashboard-class-content">
                          <div className="teacher-dashboard-class-info">
                            <h6 className="teacher-dashboard-class-title">{classItem.title}</h6>
                            <p className="teacher-dashboard-class-description">{classItem.description}</p>
                            <div className="teacher-dashboard-class-details">
                              <i className="fas fa-clock me-2"></i>
                              <span className="me-3">{classItem.time} • {classItem.day}</span>
                              <i className="fas fa-map-marker-alt me-2"></i>
                              <span>{classItem.room}</span>
                            </div>
                          </div>
                          <Button variant="outline-primary" size="sm" className="teacher-dashboard-class-btn">
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
              <Card className="teacher-dashboard-section-card">
                <Card.Body className="teacher-dashboard-section-body">
                  <h5 className="teacher-dashboard-section-title">Quick Actions</h5>
                  <div className="teacher-dashboard-actions">
                    <Button variant="outline-primary" className="teacher-dashboard-action-btn">
                      <i className="fas fa-book me-2"></i>My Courses
                    </Button>
                    <Button variant="outline-primary" className="teacher-dashboard-action-btn">
                      <i className="fas fa-tasks me-2"></i>Assignments
                    </Button>
                    <Button variant="outline-primary" className="teacher-dashboard-action-btn">
                      <i className="fas fa-chart-line me-2"></i>Grades
                    </Button>
                    <Button variant="outline-primary" className="teacher-dashboard-action-btn">
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
              <Card className="teacher-dashboard-section-card">
                <Card.Body className="teacher-dashboard-section-body">
                  <div className="teacher-dashboard-section-header">
                    <h5 className="teacher-dashboard-section-title">Recent Students</h5>
                    <Button variant="outline-primary" size="sm" className="teacher-dashboard-view-all-btn">View All</Button>
                  </div>
                  
                  {recentStudents.map((student) => (
                    <Card key={student.id} className="teacher-dashboard-student-card">
                      <Card.Body className="teacher-dashboard-student-body">
                        <Row className="align-items-center">
                          <Col xs="auto">
                            <div className="teacher-dashboard-student-avatar">
                              <span>
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </Col>
                          <Col>
                            <h6 className="teacher-dashboard-student-name">{student.name}</h6>
                            <p className="teacher-dashboard-student-course">{student.course}</p>
                          </Col>
                          <Col xs="auto">
                            <Badge className="teacher-dashboard-student-progress">{student.progress}% Progress</Badge>
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