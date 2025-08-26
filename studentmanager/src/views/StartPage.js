import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const StartPage = () => (
  <main>
    <section className="hero-section" style={{ 
      background: 'linear-gradient(135deg, rgba(44,62,80,0.9) 0%, rgba(52,152,219,0.85) 100%), url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80") center/cover',
      color: 'white',
      padding: '6rem 0',
      position: 'relative'
    }}>
      <Container className="text-center">
        <div className="hero-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="display-4 fw-bold mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            Transform Your Institution with <span style={{ 
              background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>EduManage</span>
          </h1>
          <p className="lead mb-5" style={{ fontSize: '1.3rem', opacity: 0.9 }}>
            Make operations efficient, data-driven, and student-centric with our comprehensive Student Management System
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Button 
              variant="primary" 
              size="lg" 
              href="#features"
              className="px-4 py-3 fw-semibold hero-btn"
              style={{ 
                borderRadius: '30px',
                background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                border: 'none',
                boxShadow: '0 4px 15px rgba(52,152,219,0.3)'
              }}
            >
              <i className="fas fa-star me-2"></i>Explore Features
            </Button>
            <Button 
              variant="outline-light" 
              size="lg" 
              href="#demo"
              className="px-4 py-3 fw-semibold"
              style={{ borderRadius: '30px' }}
            >
              <i className="fas fa-play-circle me-2"></i>Watch Demo
            </Button>
          </div>
        </div>
      </Container>
    </section>

    <section id="features" className="py-5" style={{ backgroundColor: '#f8f9fa', padding: '5rem 0' }}>
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="display-5 fw-bold mb-3" style={{ color: '#2c3e50' }}>Why Choose EduManage?</h2>
            <p className="lead text-muted">Our platform is designed to address the unique challenges of modern educational institutions</p>
          </Col>
        </Row>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 feature-card border-0 shadow-sm">
              <Card.Body className="p-4 text-center">
                <div className="feature-icon mb-4" style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, rgba(52,152,219,0.1) 0%, rgba(44,62,80,0.1) 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-user-graduate fa-2x" style={{ color: '#3498db' }}></i>
                </div>
                <h4 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Personalized Student Experience</h4>
                <p className="text-muted">Give students tools and information designed to support their success throughout their educational journey.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 feature-card border-0 shadow-sm">
              <Card.Body className="p-4 text-center">
                <div className="feature-icon mb-4" style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, rgba(52,152,219,0.1) 0%, rgba(44,62,80,0.1) 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-cogs fa-2x" style={{ color: '#3498db' }}></i>
                </div>
                <h4 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Automation & Efficiency</h4>
                <p className="text-muted">Streamline workflows, reduce admin workload across departments, and eliminate manual processes.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 feature-card border-0 shadow-sm">
              <Card.Body className="p-4 text-center">
                <div className="feature-icon mb-4" style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, rgba(52,152,219,0.1) 0%, rgba(44,62,80,0.1) 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-chart-line fa-2x" style={{ color: '#3498db' }}></i>
                </div>
                <h4 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Strategic Insights</h4>
                <p className="text-muted">Use data to plan and execute initiatives that elevate institutional performance and student outcomes.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>

    <section id="products" className="py-5" style={{ padding: '5rem 0' }}>
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="display-5 fw-bold mb-3" style={{ color: '#2c3e50' }}>Comprehensive Modules</h2>
            <p className="lead text-muted">Our integrated modules work together to provide a complete campus management solution</p>
          </Col>
        </Row>
        <Row className="g-4">
          <Col md={3}>
            <Card className="h-100 module-card border-0 text-center">
              <Card.Body className="p-4">
                <div className="module-icon mb-3" style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-user-check fa-lg text-white"></i>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Admissions</h5>
                <p className="text-muted">Navigate recruitment and onboarding with ease through our streamlined process.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 module-card border-0 text-center">
              <Card.Body className="p-4">
                <div className="module-icon mb-3" style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-book-open fa-lg text-white"></i>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Enrollment</h5>
                <p className="text-muted">Manage student records and curricula confidently with our intuitive system.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 module-card border-0 text-center">
              <Card.Body className="p-4">
                <div className="module-icon mb-3" style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-dollar-sign fa-lg text-white"></i>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Finance</h5>
                <p className="text-muted">Handle billing, financial aid, and accounting in one integrated platform.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 module-card border-0 text-center">
              <Card.Body className="p-4">
                <div className="module-icon mb-3" style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}>
                  <i className="fas fa-chart-pie fa-lg text-white"></i>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Analytics</h5>
                <p className="text-muted">Measure performance, track trends, and keep stakeholders informed with real-time data.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>

    <section className="py-5" style={{ 
      background: 'linear-gradient(135deg, rgba(44,62,80,0.05) 0%, rgba(52,152,219,0.05) 100%)',
      padding: '5rem 0'
    }}>
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={8}>
            <h2 className="display-5 fw-bold mb-4" style={{ color: '#2c3e50' }}>Ready to Transform Your Institution?</h2>
            <p className="lead text-muted mb-5">Join thousands of educational institutions that trust EduManage to power their operations</p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Button 
                variant="primary" 
                size="lg" 
                href="#contact"
                className="px-4 py-3 fw-semibold"
                style={{ 
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                  border: 'none'
                }}
              >
                <i className="fas fa-calendar me-2"></i>Schedule a Demo
              </Button>
              <Button 
                variant="outline-primary" 
                size="lg" 
                href="#pricing"
                className="px-4 py-3 fw-semibold"
                style={{ borderRadius: '30px', borderWidth: '2px' }}
              >
                <i className="fas fa-tag me-2"></i>View Pricing
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  </main>
);

export default StartPage;