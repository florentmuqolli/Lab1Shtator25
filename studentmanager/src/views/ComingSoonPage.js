import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ 
      background: 'linear-gradient(135deg, rgba(44,62,80,0.05) 0%, rgba(52,152,219,0.05) 100%)' 
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} className="text-center">
            <Button 
              variant="link" 
              onClick={() => navigate(-1)}
              className="position-absolute"
              style={{ 
                top: '20px', 
                left: '20px', 
                color: '#3498db', 
                textDecoration: 'none' 
              }}
            >
              <i className="fas fa-arrow-left me-1"></i> Go Back
            </Button>
            
            <div className="mb-4">
              <div 
                className="d-flex align-items-center justify-content-center mx-auto"
                style={{
                  width: '150px',
                  height: '150px',
                  color: '#3498db'
                }}
              >
                <i className="fas fa-tools fa-5x"></i>
              </div>
            </div>
            
            <h1 className="fw-bold mb-3" style={{ 
              color: '#2c3e50', 
              fontSize: '32px' 
            }}>
              Coming Soon!
            </h1>
            
            <p className="mb-2" style={{ 
              color: '#636E72', 
              fontSize: '18px', 
              lineHeight: '24px' 
            }}>
              We're working hard to bring you this feature
            </p>
            
            <p style={{ 
              color: '#636E72', 
              fontSize: '16px',
              marginTop: '20px'
            }}>
              Stay tuned for updates
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ComingSoon;