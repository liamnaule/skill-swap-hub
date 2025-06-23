import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Welcome to Skill Swap Hub</h1>
        <p className="lead">Share your skills, learn new ones, and connect with your community.</p>
        <Button as={Link} to="/skills" variant="primary" size="lg" className="mx-2 mb-2">
          Browse Skills
        </Button>
        <Button as={Link} to="/post-skill" variant="outline-primary" size="lg" className="mx-2 mb-2">
          Post a Skill
        </Button>
      </div>
      <Row className="g-4">
        <Col md={4}>
          <h3>Learn</h3>
          <p>Find experts to teach you new skills, from coding to cooking.</p>
        </Col>
        <Col md={4}>
          <h3>Teach</h3>
          <p>Share your expertise and help others grow.</p>
        </Col>
        <Col md={4}>
          <h3>Connect</h3>
          <p>Build meaningful relationships through skill sharing.</p>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;