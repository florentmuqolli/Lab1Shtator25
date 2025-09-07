import React, { useState, useEffect } from 'react'; 
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import useLogout from '../hooks/Logout';
import "../styles/Header.css"

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = useLogout(setLoading);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      const role = localStorage.getItem("role");
      setIsLoggedIn(!!token);
      setUserRole(role);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 500);

    return () => clearInterval(interval);
  }, []);

  const handleLoginClick = () => {
    setExpanded(false); 
    navigate("/login");
  };

  const handleTestClick = () => {
    setExpanded(false); 
    navigate("/studentdashboard");
  };

  const handleDashboardClick = () => {
    setExpanded(false);
    navigate("/admin-dashboard");
  };

  const isAdmin = userRole === 'admin';

  return (
    <Navbar 
      bg="white" 
      expand="lg" 
      sticky="top" 
      expanded={expanded}
      className="professional-navbar"
      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
      data-bs-theme="light"
    >
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
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
          <span style={{ 
            fontWeight: '700', 
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            EduManage
          </span>
        </Navbar.Brand>
        
        {isAdmin ? (
          <Nav className="ms-auto align-items-center">
            <Button 
              variant="primary" 
              className="ms-2 me-1"
              style={{ 
                borderRadius: '20px', 
                fontWeight: '600',
                background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
                border: 'none'
              }}
              onClick={handleDashboardClick}
            >
              <i className="fas fa-tachometer-alt me-1"></i>Go to Dashboard
            </Button>
            
            <Button 
              variant="outline-danger" 
              className="ms-2 me-1"
              style={{ borderRadius: '20px', fontWeight: '600' }}
              onClick={() => {
                setExpanded(false);
                handleLogout(); 
              }}
              disabled={loading}
            >
              <i className="fas fa-sign-out-alt me-1"></i>
              {loading ? "Logging out..." : "Logout"}
            </Button>
          </Nav>
        ) : (
          <>
            <Navbar.Toggle 
              aria-controls="sm-navbar" 
              onClick={() => setExpanded(expanded ? false : true)}
            >
              <span className="navbar-toggler-icon"></span>
            </Navbar.Toggle>
            
            <Navbar.Collapse id="sm-navbar">
              <Nav className="ms-auto align-items-center">
                <Nav.Link href="#features" className="mx-2 nav-link-custom" onClick={() => setExpanded(false)}>
                  <i className="fas fa-star me-1"></i>Features
                </Nav.Link>
                
                <Nav.Link href="#products" className="mx-2 nav-link-custom" onClick={() => setExpanded(false)}>
                  <i className="fas fa-cubes me-1"></i>Modules
                </Nav.Link>
                
                <Nav.Link href="#contact" className="mx-2 nav-link-custom" onClick={() => setExpanded(false)}>
                  <i className="fas fa-phone me-1"></i>Contact
                </Nav.Link>
                
                <NavDropdown 
                  title={<span><i className="fas fa-ellipsis-h me-1"></i>More</span>} 
                  id="nav-dropdown"
                  className="mx-2 nav-link-custom"
                >
                  <NavDropdown.Item href="#about" onClick={() => setExpanded(false)}>
                    <i className="fas fa-info-circle me-2"></i>About
                  </NavDropdown.Item>
                  
                  <NavDropdown.Item href="#support" onClick={() => setExpanded(false)}>
                    <i className="fas fa-life-ring me-2"></i>Support
                  </NavDropdown.Item>
                  
                  <NavDropdown.Divider />
                  
                  <NavDropdown.Item href="#docs" onClick={() => setExpanded(false)}>
                    <i className="fas fa-book me-2"></i>Documentation
                  </NavDropdown.Item>
                </NavDropdown>

                <Button 
                  variant="outline-primary" 
                  className="ms-2 me-1 login-btn"
                  style={{ borderRadius: '20px', fontWeight: '600' }}
                  onClick={handleTestClick}
                >
                  <i className="fas fa-user me-1"></i>Test
                </Button>
                
                {isLoggedIn ? (
                  <Button 
                    variant="outline-danger" 
                    className="ms-2 me-1 login-btn"
                    style={{ borderRadius: '20px', fontWeight: '600' }}
                    onClick={() => {
                      setExpanded(false);
                      handleLogout(); 
                    }}
                    disabled={loading}
                  >
                    <i className="fas fa-sign-out-alt me-1"></i>
                    {loading ? "Logging out..." : "Logout"}
                  </Button>
                ) : (
                  <Button 
                    variant="outline-primary" 
                    className="ms-2 me-1 login-btn"
                    style={{ borderRadius: '20px', fontWeight: '600' }}
                    onClick={handleLoginClick}
                  >
                    <i className="fas fa-sign-in-alt me-1"></i>Login
                  </Button>
                )}
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;