import { useContext } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Container className="py-5"><p>Loading...</p></Container>;

  const mockUser = user || {
    name: 'John Doe',
    bio: 'Passionate about teaching coding and learning guitar.',
    skills: ['Python', 'JavaScript'],
    image: '',
  };

  return (
    <Container className="py-5">
      <h2>Profile</h2>
      <Row className="g-4">
        <Col md={4} className="text-center">
          <img
            src={mockUser.image}
            alt="Profile"
            className=""
          />
        </Col>
        <Col md={8}>
          <h3>{mockUser.name}</h3>
          <p>{mockUser.bio}</p>
          <h5>Skills Offered</h5>
          <ul>
            {mockUser.skills.map(skill => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
          <Button variant="outline-primary">Edit Profile</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;