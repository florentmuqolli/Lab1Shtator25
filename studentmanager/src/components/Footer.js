import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import "../styles/Footer.css"

const Footer = () => (
  <footer className="footer mt-5" style={{ backgroundColor: '#f8f9fa', padding: '3rem 0' }}>
    <Container>
      <Row>
        <Col lg={4} md={6} className="mb-4">
          <div className="d-flex align-items-center mb-3">
            <div 
              className="brand-icon d-flex align-items-center justify-content-center me-2"
              style={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                width: '40px',
                height: '40px',
                borderRadius: '8px'
              }}
            >
              <i className="fas fa-graduation-cap text-white"></i>
            </div>
            <h5 style={{ 
              fontWeight: '700',
              background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              EduManage
            </h5>
          </div>
          <p className="text-muted" style={{ lineHeight: '1.6' }}>
            The complete student management solution for modern universities. Streamline operations, 
            enhance learning experiences, and connect your campus community.
          </p>
          <div className="social-icons mt-3">
            <a href="https://twitter.com" className="me-3 social-link">
              <i className="fab fa-twitter fa-lg"></i>
            </a>
            <a href="https://facebook.com" className="me-3 social-link">
              <i className="fab fa-facebook-f fa-lg"></i>
            </a>
            <a href="https://linkedin.com" className="me-3 social-link">
              <i className="fab fa-linkedin-in fa-lg"></i>
            </a>
            <a href="https://instagram.com" className="social-link">
              <i className="fab fa-instagram fa-lg"></i>
            </a>
          </div>
        </Col>
        
        <Col lg={2} md={6} className="mb-4">
          <h6 style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '1.2rem' }}>Product</h6>
          <ul className="list-unstyled">
            <li className="mb-2">
              <a href="#features" className="footer-link">Features</a>
            </li>
            <li className="mb-2">
              <a href="#modules" className="footer-link">Modules</a>
            </li>
            <li className="mb-2">
              <a href="#pricing" className="footer-link">Pricing</a>
            </li>
            <li className="mb-2">
              <a href="#demo" className="footer-link">Demo</a>
            </li>
          </ul>
        </Col>
        
        <Col lg={2} md={6} className="mb-4">
          <h6 style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '1.2rem' }}>Resources</h6>
          <ul className="list-unstyled">
            <li className="mb-2">
              <a href="#documentation" className="footer-link">Documentation</a>
            </li>
            <li className="mb-2">
              <a href="#blog" className="footer-link">Blog</a>
            </li>
            <li className="mb-2">
              <a href="#webinars" className="footer-link">Webinars</a>
            </li>
            <li className="mb-2">
              <a href="#support" className="footer-link">Support</a>
            </li>
          </ul>
        </Col>
        
        <Col lg={2} md={6} className="mb-4">
          <h6 style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '1.2rem' }}>Company</h6>
          <ul className="list-unstyled">
            <li className="mb-2">
              <a href="#about" className="footer-link">About Us</a>
            </li>
            <li className="mb-2">
              <a href="#careers" className="footer-link">Careers</a>
            </li>
            <li className="mb-2">
              <a href="#partners" className="footer-link">Partners</a>
            </li>
            <li className="mb-2">
              <a href="#contact" className="footer-link">Contact</a>
            </li>
          </ul>
        </Col>
        
        <Col lg={2} md={6} className="mb-4">
          <h6 style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '1.2rem' }}>Legal</h6>
          <ul className="list-unstyled">
            <li className="mb-2">
              <a href="#privacy" className="footer-link">Privacy Policy</a>
            </li>
            <li className="mb-2">
              <a href="#terms" className="footer-link">Terms of Use</a>
            </li>
            <li className="mb-2">
              <a href="#cookies" className="footer-link">Cookie Policy</a>
            </li>
            <li className="mb-2">
              <a href="#sitemap" className="footer-link">Sitemap</a>
            </li>
          </ul>
        </Col>
      </Row>
      
      <hr style={{ borderColor: '#dee2e6', margin: '2rem 0' }} />
      
      <Row className="align-items-center">
        <Col md={6}>
          <p className="text-muted mb-0">
            © {new Date().getFullYear()} EduManage. All rights reserved.
          </p>
        </Col>
        <Col md={6} className="text-md-end">
          <div className="app-badges">
            <span className="text-muted me-2">Get the app:</span>
            <a href="#appstore" className="badge-link me-2">
              <i className="fab fa-apple fa-lg"></i>
            </a>
            <a href="#playstore" className="badge-link">
              <i className="fab fa-google-play fa-lg"></i>
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;