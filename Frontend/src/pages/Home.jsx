import { Container, Button, Row, Col, Image } from 'react-bootstrap';
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
      <Row className="g-4 text-center">
        <Col md={4}>
          <Image
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
            alt="Learn new skills"
            className="section-img mb-3"
            fluid
          />
          <h3 className="fw-semibold">Learn</h3>
          <p>Find experts to teach you new skills, from coding to cooking.</p>
          <p className="text-muted">Unlock your potential with hands-on guidance.</p>
        </Col>
        <Col md={4}>
          <Image
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655"
            alt="Teach your expertise"
            className="section-img mb-3"
            fluid
          />
          <h3 className="fw-semibold">Teach</h3>
          <p>Share your expertise and help others grow.</p>
          <p className="text-muted">Inspire others while sharpening your craft.</p>
        </Col>
        <Col md={4}>
          <Image
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952"
            alt="Connect with community"
            className="section-img mb-3"
            fluid
          />
          <h3 className="fw-semibold">Connect</h3>
          <p>Build meaningful relationships through skill sharing.</p>
          <p className="text-muted">Join a vibrant community of learners and mentors.</p>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;