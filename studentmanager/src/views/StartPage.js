import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const StartPage = () => (
  <main>
    <section className="hero-section" style={{ 
      background: 'linear-gradient(135deg, rgba(44,62,80,0.9) 0%, rgba(52,152,219,0.85) 100%), url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80") center/cover',
      color: 'white',
      padding: '6rem 0',
      position: 'relative'
    }}>
      <Container className="text-center">
        <div className="hero-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="mb-4">
            <div 
              className="brand-icon d-flex align-items-center justify-content-center mx-auto"
              style={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                width: '80px',
                height: '80px',
                borderRadius: '50%'
              }}
            >
              <i className="fas fa-graduation-cap fa-2x text-white"></i>
            </div>
          </div>
          <h1 className="display-4 fw-bold mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              TRW<span style={{ 
              background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Cardinal System</span>
          </h1>
          <p className="lead mb-5" style={{ fontSize: '1.3rem', opacity: 0.9 }}>
            The official student management portal for TRW University students, faculty, and staff
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
              <i className="fas fa-user me-2"></i>Student Login
            </Button>
            <Button 
              variant="outline-light" 
              size="lg" 
              href="#features"
              className="px-4 py-3 fw-semibold"
              style={{ borderRadius: '30px' }}
            >
              <i className="fas fa-chalkboard-teacher me-2"></i>Faculty Portal
            </Button>
          </div>
        </div>
      </Container>
    </section>

    <section id="features" className="py-5" style={{ backgroundColor: '#f8f9fa', padding: '5rem 0' }}>
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="display-5 fw-bold mb-3" style={{ color: '#2c3e50' }}>TRW Cardinal System</h2>
            <p className="lead text-muted">Access everything you need for your TRW academic journey in one secure platform</p>
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
                  <i className="fas fa-calendar-alt fa-2x" style={{ color: '#3498db' }}></i>
                </div>
                <h4 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Course Registration</h4>
                <p className="text-muted">Register for classes, view your schedule, and manage your academic plan for current and upcoming quarters.</p>
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
                  <i className="fas fa-graduation-cap fa-2x" style={{ color: '#3498db' }}></i>
                </div>
                <h4 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Academic Records</h4>
                <p className="text-muted">View your grades, transcripts, degree progress, and academic standing all in one place.</p>
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
                  <i className="fas fa-dollar-sign fa-2x" style={{ color: '#3498db' }}></i>
                </div>
                <h4 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Student Accounts</h4>
                <p className="text-muted">Manage tuition payments, view your account balance, and access financial aid information.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>

    <section id="products" className="py-5" style={{ padding: '5rem 0', backgroundColor: '#fafafa' }}>
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="display-5 fw-bold mb-3" style={{ color: '#2c3e50' }}>Resources & Support</h2>
            <p className="lead text-muted">Tools and services to support your success at TRW University</p>
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
                  <i className="fas fa-book-open fa-lg text-white"></i>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Canvas Access</h5>
                <p className="text-muted">Access your course materials, submit assignments, and connect with instructors.</p>
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
                  <i className="fas fa-home fa-lg text-white"></i>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Housing Portal</h5>
                <p className="text-muted">Apply for on-campus housing, submit maintenance requests, and access residential services.</p>
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
                  <i className="fas fa-id-card fa-lg text-white"></i>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Student ID Services</h5>
                <p className="text-muted">Manage your student ID card, access building permissions, and report lost cards.</p>
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
                  <i className="fas fa-hand-holding-heart fa-lg text-white"></i>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Support Services</h5>
                <p className="text-muted">Access counseling, disability resources, and other student support services.</p>
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
            <h2 className="display-5 fw-bold mb-4" style={{ color: '#2c3e50' }}>Need Assistance?</h2>
            <p className="lead text-muted mb-5">TRW's IT Help Desk is available to support students, faculty, and staff with any technical issues</p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Button 
                variant="primary" 
                size="lg" 
                href="tel:650-725-4357"
                className="px-4 py-3 fw-semibold"
                style={{ 
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                  border: 'none'
                }}
              >
                <i className="fas fa-phone me-2"></i>(650) 725-HELP
              </Button>
              <Button 
                variant="outline-primary" 
                size="lg" 
                href="mailto:help@trw.edu"
                className="px-4 py-3 fw-semibold"
                style={{ borderRadius: '30px', borderWidth: '2px' }}
              >
                <i className="fas fa-envelope me-2"></i>help@trw.edu
              </Button>
            </div>
            <div className="mt-4">
              <p className="text-muted mb-0">Hours: Monday-Friday 7AM-7PM | Saturday-Sunday 8AM-5PM</p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  </main>
);

export default StartPage;