import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="white" expand="lg" className="navbar shadow-sm">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="navbar-brand">
            <i className="bi bi-graph-up me-2"></i>
            Analytics Dashboard
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {currentUser ? (
            <>
              <Nav className="me-auto">
                <LinkContainer to="/dashboard">
                  <Nav.Link className="nav-link">
                    <i className="bi bi-speedometer2 me-1"></i>
                    Dashboard
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/websites">
                  <Nav.Link className="nav-link">
                    <i className="bi bi-globe me-1"></i>
                    Websites
                  </Nav.Link>
                </LinkContainer>
              </Nav>

              <Nav>
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="div"
                    className="d-flex align-items-center text-decoration-none cursor-pointer"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                           style={{ width: '32px', height: '32px' }}>
                        <span className="text-white fw-bold">
                          {currentUser.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="d-none d-md-block">
                        <div className="fw-medium">{currentUser.username}</div>
                        <div className="text-muted small">{currentUser.email}</div>
                      </div>
                      <i className="bi bi-chevron-down ms-2"></i>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Header>
                      <div className="fw-medium">{currentUser.username}</div>
                      <div className="text-muted small">{currentUser.email}</div>
                    </Dropdown.Header>

                    <Dropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <LinkContainer to="/login">
                <Nav.Link className="nav-link">Login</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/register">
                <Button variant="primary" className="btn-custom btn-primary-custom ms-2">
                  Get Started
                </Button>
              </LinkContainer>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
