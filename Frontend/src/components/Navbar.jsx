import { NavLink } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';

function Navbar() {
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
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;