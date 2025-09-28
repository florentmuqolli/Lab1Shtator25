import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Modal, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [queryEmail, setQueryEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    async function checkToken() {
      const token = localStorage.getItem("accessToken");
      const role = localStorage.getItem("role");

      if (token && role === "admin") {
        navigate("/admin-dashboard");
      } else if (token && role === "teacher") {
        navigate("/teacher-dashboard");
      } else if (token && role === "student") {
        navigate("/student-dashboard");
      }
    }
    checkToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      return;
    }
    
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form, {
        withCredentials: true,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("role", response.data.user.role);

      setTimeout(() => {
        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (response.data.user.role === "teacher") {
          navigate("/teacher-dashboard");
        } else {
          navigate("/student-dashboard");
        }
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setLoading(false);
      const status = error.response?.status;
      const message = error.response?.data?.message || "Something went wrong";

      if (status === 403 && message.includes("pending")) {
        toast.info("Account Pending: " + message);
      } else if (status === 403 && message.includes("denied")) {
        toast.error("Registration Denied: " + message);
      } else {
        toast.error("Login Failed: " + message);
      }
    }
  };

  const checkRequestStatus = async () => {
    if (!queryEmail.includes('@')) {
      setStatusMessage('Please enter a valid email');
      return;
    }

    setChecking(true);
    setStatusMessage('');
    
    try {
      const res = await api.get(`/auth/check-request-status?email=${queryEmail}`);
      const { status } = res.data;
      
      if (status === 'approved') {
        setStatusMessage('✅ Approved — You can now log in.');
      } else if (status === 'pending') {
        setStatusMessage('⏳ Pending — Please wait for admin approval.');
      } else if (status === 'denied') {
        setStatusMessage('❌ Denied — Your registration was denied.');
      } else {
        setStatusMessage('⚠️ Unknown status.');
      }
    } catch (err) {
      setStatusMessage('No registration requests found with this email.');
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ 
        background: 'linear-gradient(135deg, rgba(44,62,80,0.05) 0%, rgba(52,152,219,0.05) 100%)' 
      }}>
        <Spinner animation="border" style={{ color: '#3498db' }} />
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, rgba(44,62,80,0.05) 0%, rgba(52,152,219,0.05) 100%)' 
    }}>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Button 
              variant="outline-primary" 
              className="mb-4" 
              onClick={() => navigate('/')}
              style={{ 
                borderRadius: '20px',
                borderColor: '#3498db'
              }}
            >
              <i className="fas fa-arrow-left me-2"></i> Back to Home
            </Button>
            
            <Card className="shadow border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)'
                    }}
                  >
                    <i className="fas fa-graduation-cap text-white fa-2x"></i>
                  </div>
                  <h2 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>Welcome to TRW Cardinal System</h2>
                  <p className="text-muted">Please sign in to continue to your portal</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#2c3e50', fontWeight: '500' }}>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      style={{ borderRadius: '10px', padding: '12px' }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#2c3e50', fontWeight: '500' }}>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      style={{ borderRadius: '10px', padding: '12px' }}
                    />
                    <div className="text-end mt-2">
                      <Link to="/forgot-password" style={{ color: '#3498db', textDecoration: 'none', fontWeight: '500' }}>
                        Forgot password?
                      </Link>
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 py-3 fw-semibold border-0"
                    disabled={loading || !form.email || !form.password}
                    onClick={handleSubmit}
                    style={{ 
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(52, 152, 219, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Form>

                <div className="d-flex align-items-center my-4">
                  <hr className="flex-grow-1" style={{ borderColor: '#dee2e6' }} />
                  <span className="px-3 text-muted">or</span>
                  <hr className="flex-grow-1" style={{ borderColor: '#dee2e6' }} />
                </div>

                <div className="text-center">
                  <span className="text-muted">Waiting for confirmation?</span>
                  <Button 
                    variant="outline-primary" 
                    className="w-100 mt-3"
                    onClick={() => setShowStatusModal(true)}
                    style={{ borderRadius: '10px', borderColor: '#3498db' }}
                  >
                    Check Registration Status
                  </Button>
                  
                  <div className="mt-3">
                    <span className="text-muted">Don't have an account?</span>
                    <Link to="/register" style={{ color: '#3498db', textDecoration: 'none', fontWeight: '600', marginLeft: '5px' }}>
                      Sign Up
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: '1px solid #e9ecef' }}>
          <Modal.Title style={{ color: '#2c3e50' }}>Check Registration Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label style={{ color: '#2c3e50', fontWeight: '500' }}>Enter your email</Form.Label>
            <Form.Control
              type="email"
              value={queryEmail}
              onChange={(e) => setQueryEmail(e.target.value)}
              placeholder="your.email@trw.edu"
              style={{ borderRadius: '10px', padding: '12px' }}
            />
          </Form.Group>
          
          <Button 
            className="w-100 mt-3 border-0"
            onClick={checkRequestStatus}
            disabled={checking}
            style={{ 
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
              padding: '12px'
            }}
          >
            {checking ? <Spinner animation="border" size="sm" /> : "Check Status"}
          </Button>
          
          {statusMessage && (
            <div className={`alert mt-3 mb-0 ${statusMessage.includes('✅') ? 'alert-success' : 
                statusMessage.includes('⏳') ? 'alert-info' : 
                statusMessage.includes('❌') ? 'alert-danger' : 'alert-warning'}`}
                style={{ borderRadius: '10px' }}
            >
              {statusMessage}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Login;