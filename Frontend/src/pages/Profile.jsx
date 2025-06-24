import { useContext, useEffect, useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function Profile() {
  const { user, loading } = useContext(AuthContext);
  const [userSkills, setUserSkills] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchUserSkills = async () => {
        try {
          const res = await axios.get('http://127.0.0.1:5000/skills/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setUserSkills(res.data.filter(skill => skill.user_id === user.id));
        } catch (err) {
          console.error('Failed to fetch skills:', err.response?.data?.error || err.message);
        }
      };
      fetchUserSkills();
    }
  }, [user]);

  if (loading) return <Container className="py-5"><p>Loading...</p></Container>;

  return (
    <Container className="py-5">
      <h2>Profile</h2>
      <Row className="g-4">
        <Col md={4} className="text-center">
          <img src={user?.image || ''} alt="Profile" className="" />
        </Col>
        <Col md={8}>
          <h3>{user?.name || 'Unknown'}</h3>
          <p>{user?.bio || 'No bio available.'}</p>
          <h5>Skills Offered</h5>
          <ul>
            {userSkills.length > 0 ? (
              userSkills.map(skill => <li key={skill.id}>{skill.title}</li>)
            ) : (
              <li>No skills listed.</li>
            )}
          </ul>
          <Button variant="outline-primary">Edit Profile</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;