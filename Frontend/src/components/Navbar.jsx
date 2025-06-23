import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <BSNavbar.Brand as={NavLink} to="/">Skill Swap Hub</BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/skills">Skills</Nav.Link>
            <Nav.Link as={NavLink} to="/post-skill">Post Skill</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
                {user.role === 'admin' && (
                  <Nav.Link as={NavLink} to="/admin">Admin</Nav.Link>
                )}
                <Nav.Link as={Button} variant="link" onClick={handleLogout} className="text-white">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;