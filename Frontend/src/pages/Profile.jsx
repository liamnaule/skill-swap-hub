import { useContext, useEffect, useState } from 'react';
import { Container, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import profilePic from '../assets/profile-placeholder.png'; 

function Profile() {
  const { user, loading, setUser } = useContext(AuthContext);
  const [userSkills, setUserSkills] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({ username: user?.username || '', email: user?.email || '' });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setEditData({ username: user.username, email: user.email });
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

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://127.0.0.1:5000/users/${user.id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditSuccess('Profile updated!');
      setShowEdit(false);
      setUser(prev => ({ ...prev, username: editData.username, email: editData.email }));
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  if (loading) return <Container className="py-5"><p>Loading...</p></Container>;

  return (
    <Container className="py-5">
      <h2>Profile</h2>
      <Row className="g-4">
        <Col md={4} className="text-center">
          <img src={profilePic} alt="Profile" className="" />
        </Col>
        <Col md={8}>
          <h3>{user?.username || 'Unknown'}</h3>
          <p>{user?.bio || 'No bio available.'}</p>
          <h5>Skills Offered</h5>
          <ul>
            {userSkills.length > 0 ? (
              userSkills.map(skill => <li key={skill.skill_id}>{skill.title}</li>)
            ) : (
              <li>No skills listed.</li>
            )}
          </ul>
          <Button variant="outline-primary" onClick={() => setShowEdit(true)}>Edit Profile</Button>
          {showEdit && (
            <Form onSubmit={handleEditSubmit} className="mt-3">
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control name="username" value={editData.username} onChange={handleEditChange} required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" type="email" value={editData.email} onChange={handleEditChange} required />
              </Form.Group>
              <Button type="submit" className="mt-2">Save</Button>
              <Button variant="secondary" className="mt-2 ms-2" onClick={() => setShowEdit(false)}>Cancel</Button>
              {editError && <Alert variant="danger" className="mt-2">{editError}</Alert>}
              {editSuccess && <Alert variant="success" className="mt-2">{editSuccess}</Alert>}
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;