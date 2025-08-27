import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal, Spinner, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'student' 
  });
  const [loading, setLoading] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.name.length < 3) {
      toast.error("Please provide your full name (at least 3 characters).");
      return;
    }
    if (!form.email.includes('@')) {
      toast.error("Please provide a valid email.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/request-register', form);
      toast.success("Applied Successfully");
      setShowApprovalModal(true);
      startCountdown();
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error("Registration Failed: " + message);
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (countdown === 0 && showApprovalModal) {
      navigate('/login');
    }
  }, [countdown, showApprovalModal, navigate]);

  const handleLoginNow = () => {
    setShowApprovalModal(false);
    setCountdown(0); 
    navigate('/login');
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
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ 
      background: 'linear-gradient(135deg, rgba(44,62,80,0.05) 0%, rgba(52,152,219,0.05) 100%)' 
    }}>
      <ToastContainer position="top-right" autoClose={5000} />
      
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow border-0" style={{ borderRadius: '15px' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div 
                    className="brand-icon d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%'
                    }}
                  >
                    <i className="fas fa-user-plus fa-2x text-white"></i>
                  </div>
                  <h2 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>
                    Create Account
                  </h2>
                  <p style={{ color: '#636E72' }}>Join our community today</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#2c3e50', fontWeight: '500' }}>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      style={{
                        border: '1px solid #DFE6E9',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '16px',
                        color: '#2D3436',
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#2c3e50', fontWeight: '500' }}>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      style={{
                        border: '1px solid #DFE6E9',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '16px',
                        color: '#2D3436',
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#2c3e50', fontWeight: '500' }}>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      style={{
                        border: '1px solid #DFE6E9',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '16px',
                        color: '#2D3436',
                      }}
                    />
                    <Form.Text style={{ color: '#636E72' }}>Must be at least 6 characters</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ color: '#2c3e50', fontWeight: '500' }}>I am a</Form.Label>
                    <div className="d-flex gap-2">
                      <Button
                        variant={form.role === 'student' ? 'primary' : 'outline-primary'}
                        onClick={() => handleChange('role', 'student')}
                        className="flex-grow-1"
                        style={{ 
                          borderRadius: '12px',
                          padding: '16px',
                          borderColor: '#3498db',
                          color: form.role === 'student' ? 'white' : '#3498db'
                        }}
                      >
                        Student
                      </Button>
                      <Button
                        variant={form.role === 'teacher' ? 'primary' : 'outline-primary'}
                        onClick={() => handleChange('role', 'teacher')}
                        className="flex-grow-1"
                        style={{ 
                          borderRadius: '12px',
                          padding: '16px',
                          borderColor: '#3498db',
                          color: form.role === 'teacher' ? 'white' : '#3498db'
                        }}
                      >
                        Teacher
                      </Button>
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading || form.password.length < 6 || form.name.length < 3 || !form.email.includes('@')}
                    className="w-100 py-3 border-0"
                    style={{
                      background: (form.password.length < 6 || form.name.length < 3 || !form.email.includes('@') || loading)
                        ? 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)' 
                        : 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Form>

                <p className="text-center mt-3" style={{ color: '#636E72', fontSize: '14px' }}>
                  By registering, you agree to our{' '}
                  <a href="#terms" style={{ color: '#3498db', textDecoration: 'none', fontWeight: '500' }}>Terms</a> and{' '}
                  <a href="#privacy" style={{ color: '#3498db', textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</a>
                </p>

                <div className="d-flex align-items-center my-4">
                  <hr className="flex-grow-1" style={{ borderColor: '#DFE6E9' }} />
                  <span className="px-3" style={{ color: '#636E72' }}>or</span>
                  <hr className="flex-grow-1" style={{ borderColor: '#DFE6E9' }} />
                </div>

                <Button
                  variant="outline-primary"
                  className="w-100 py-3"
                  style={{ 
                    borderRadius: '12px',
                    borderColor: '#DFE6E9',
                    color: '#2D3436',
                    fontWeight: '500'
                  }}
                >
                  <i className="fab fa-google me-2"></i>Continue with Google
                </Button>

                <div className="text-center mt-4">
                  <span style={{ color: '#636E72' }}>Already have an account?</span>
                  <Button
                    variant="link"
                    onClick={() => navigate('/login')}
                    style={{ color: '#3498db', fontWeight: '600', textDecoration: 'none', padding: '4px' }}
                  >
                    Sign In
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      
      <Modal show={showApprovalModal} onHide={() => setShowApprovalModal(false)} centered>
        <Modal.Body className="p-4" style={{ borderRadius: '16px' }}>
          <div className="text-center">
            <h5 className="fw-bold mb-3" style={{ color: '#2c3e50', fontSize: '20px' }}>
              {form.role === 'teacher' ? 'Teacher' : 'Student'} Account Pending Approval
            </h5>
            <p style={{ color: '#636E72', lineHeight: '24px', marginBottom: '24px' }}>
              Your {form.role} account will be ready to use in {countdown} seconds after admin approval.
            </p>
            <div className="d-flex justify-content-center align-items-center">
              <span style={{ color: '#636E72', marginRight: '12px' }}>Go to login now?</span>
              <Button
                onClick={handleLoginNow}
                style={{ 
                  background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px'
                }}
              >
                OK
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Register;