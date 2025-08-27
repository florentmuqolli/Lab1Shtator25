import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Modal, Spinner, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [passwordResetModalVisible, setPasswordResetModalVisible] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('/auth/forgot-password', { email });
      setLoading(false);
      toast.success(response.data.message || 'Reset code sent to your email');
      setVerificationModalVisible(true);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Something went wrong';
      toast.error('Failed to send reset code: ' + message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter the 6-digit code');
      return;
    }
    setVerificationLoading(true);
    try {
      const response = await axios.post('/auth/verify-reset-code', { email, code });
      toast.success(response.data.message || 'Code verified successfully');
      setVerificationModalVisible(false);
      setPasswordResetModalVisible(true);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to verify code';
      toast.error('Verification failed: ' + message);
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error('Please enter and confirm your new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password should be at least 6 characters');
      return;
    }
    setResetLoading(true);
    try {
      const response = await axios.post('/auth/reset-password', {
        email,
        code,
        password: newPassword,
      });
      toast.success(response.data.message || 'Password updated successfully');
      setPasswordResetModalVisible(false);
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to reset password';
      toast.error('Reset failed: ' + message);
    } finally {
      setResetLoading(false);
    }
  };

  const handleNavigate = () => {
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
          <Col md={6} lg={5}>
            <Card className="shadow border-0" style={{ borderRadius: '15px' }}>
              <Card.Body className="p-4 position-relative">
                <Button 
                  variant="link" 
                  onClick={handleNavigate}
                  className="position-absolute"
                  style={{ 
                    top: '10px', 
                    left: '10px', 
                    color: '#3498db', 
                    textDecoration: 'none' 
                  }}
                >
                  <i className="fas fa-arrow-left me-1"></i> Go Back
                </Button>
                
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <div 
                      className="brand-icon d-flex align-items-center justify-content-center mx-auto"
                      style={{
                        background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%'
                      }}
                    >
                      <i className="fas fa-lock fa-1x text-white"></i>
                    </div>
                  </div>
                  <h2 className="fw-bold mb-3" style={{ 
                    color: '#2c3e50', 
                    fontSize: '26px' 
                  }}>
                    Forgot Password
                  </h2>
                  <p className="mb-4" style={{ 
                    color: '#636E72', 
                    fontSize: '15px', 
                    lineHeight: '22px' 
                  }}>
                    Enter your email address below and we'll send you a 6-digit code to reset your password.
                  </p>
                </div>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      border: '1px solid #E0E0E0',
                      borderRadius: '10px',
                      padding: '14px 16px',
                      fontSize: '16px',
                      color: '#2D3436',
                    }}
                  />
                </Form.Group>

                <Button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-100 py-3 border-0"
                  style={{
                    background: loading 
                      ? 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)' 
                      : 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'Send Reset Code'
                  )}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Verification Modal */}
      <Modal show={verificationModalVisible} onHide={() => setVerificationModalVisible(false)} centered>
        <Modal.Body className="p-4" style={{ borderRadius: '15px' }}>
          <div className="text-center mb-4">
            <h5 className="fw-bold mb-2" style={{ 
              color: '#3498db', 
              fontSize: '22px' 
            }}>
              Verify Your Code
            </h5>
            <p className="mb-3" style={{ 
              color: '#636E72', 
              fontSize: '14px', 
              lineHeight: '20px' 
            }}>
              Please enter the 6-digit code sent to your email
            </p>
          </div>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              style={{
                border: '1px solid #E0E0E0',
                borderRadius: '10px',
                padding: '14px 16px',
                fontSize: '16px',
                color: '#2D3436',
              }}
            />
          </Form.Group>

          <Button
            onClick={handleVerifyCode}
            disabled={verificationLoading}
            className="w-100 py-3 mb-3 border-0"
            style={{
              background: verificationLoading 
                ? 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)' 
                : 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {verificationLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Verify Code'
            )}
          </Button>

          <Button
            variant="link"
            onClick={() => setVerificationModalVisible(false)}
            className="w-100 text-decoration-none"
            style={{ color: '#3498db', fontWeight: '600' }}
          >
            Cancel
          </Button>
        </Modal.Body>
      </Modal>

      {/* Password Reset Modal */}
      <Modal show={passwordResetModalVisible} onHide={() => setPasswordResetModalVisible(false)} centered>
        <Modal.Body className="p-4" style={{ borderRadius: '15px' }}>
          <div className="text-center mb-4">
            <h5 className="fw-bold mb-2" style={{ 
              color: '#3498db', 
              fontSize: '22px' 
            }}>
              Set New Password
            </h5>
            <p className="mb-3" style={{ 
              color: '#636E72', 
              fontSize: '14px', 
              lineHeight: '20px' 
            }}>
              Please enter and confirm your new password
            </p>
          </div>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                border: '1px solid #E0E0E0',
                borderRadius: '10px',
                padding: '14px 16px',
                fontSize: '16px',
                color: '#2D3436',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                border: '1px solid #E0E0E0',
                borderRadius: '10px',
                padding: '14px 16px',
                fontSize: '16px',
                color: '#2D3436',
              }}
            />
          </Form.Group>

          <Button
            onClick={handleResetPassword}
            disabled={resetLoading}
            className="w-100 py-3 mb-3 border-0"
            style={{
              background: resetLoading 
                ? 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)' 
                : 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {resetLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Reset Password'
            )}
          </Button>

          <Button
            variant="link"
            onClick={() => setPasswordResetModalVisible(false)}
            className="w-100 text-decoration-none"
            style={{ color: '#3498db', fontWeight: '600' }}
          >
            Cancel
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ForgotPasswordScreen;