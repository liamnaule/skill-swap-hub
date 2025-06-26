import { useContext, useEffect, useState } from 'react';
import { Container, Button, Row, Col, Form, Alert, Table } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext'; 
import axios from 'axios';
import profilePic from '../assets/profile-placeholder.png';

function Profile() {
  const { user, loading, setUser } = useContext(AuthContext);
  const [userSkills, setUserSkills] = useState([]);
  const [userSessions, setUserSessions] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({ username: user?.username || '', email: user?.email || '', bio: user?.bio || '' });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [ratingInputs, setRatingInputs] = useState({});
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');

  useEffect(() => {
    if (user) {
      console.log('Current user:', user);
      setEditData({ username: user.username, email: user.email, bio: user.bio || '' });
      const fetchUserSkills = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/skills/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          console.log('Fetched skills:', res.data);
          setUserSkills(res.data.filter(skill => skill.user_id === user.id));
        } catch (err) {
          console.error('Failed to fetch skills:', err.response?.data?.error || err.message);
        }
      };
      const fetchUserSessions = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/sessions/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          console.log('Fetched sessions:', res.data);
          const filteredSessions = res.data.filter(
            session => session.teacher_id === user.id || session.learner_id === user.id
          );
          console.log('Filtered sessions:', filteredSessions);
          setUserSessions(filteredSessions);
        } catch (err) {
          console.error('Failed to fetch sessions:', err.response?.data?.error || err.message);
          setUserSessions([]);
        }
      };
      fetchUserSkills();
      fetchUserSessions();
    } else {
      console.log('No user logged in');
    }
  }, [user]);

  useEffect(() => {
    if (ratingSuccess || ratingError) {
      const timer = setTimeout(() => {
        setRatingSuccess('');
        setRatingError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [ratingSuccess, ratingError]);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL}/users/${user.id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditSuccess('Profile updated!');
      setShowEdit(false);
      setUser(prev => ({ ...prev, username: editData.username, email: editData.email, bio: editData.bio, role: prev.role }));
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleRatingChange = (sessionId, value) => {
    console.log(`Rating changed for session ${sessionId}: ${value}`);
    setRatingInputs({ ...ratingInputs, [sessionId]: value });
  };

  const handleRateSession = async (sessionId, isUpdate = false) => {
    setRatingError('');
    setRatingSuccess('');
    const rating = Number(ratingInputs[sessionId]);
    if (!rating || rating < 1 || rating > 5) {
      setRatingError('Please select a rating between 1 and 5');
      console.log('Rating validation failed:', rating);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      console.log(`Sending ${isUpdate ? 'PATCH' : 'POST'} request for session ${sessionId} with rating ${rating}`);
      let response;
      if (isUpdate) {
        response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/ratings/${sessionId}`,
          { rating },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRatingSuccess('Rating updated successfully!');
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/ratings/`,
          { session_id: sessionId, rating },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRatingSuccess('Session rated successfully!');
      }
      console.log('Rating response:', response.data);
      const updatedSession = response.data.session;
      setUserSessions(userSessions.map(s =>
        s.id === sessionId ? { ...s, rating: updatedSession.rating } : s
      ));
      setRatingInputs({ ...ratingInputs, [sessionId]: '' });
    } catch (err) {
      console.error('Rating error:', err.response?.data, err.response?.status);
      const errorMsg = err.response?.data?.error || 'Failed to rate session';
      setRatingError(errorMsg);
    }
  };

  if (loading) return <Container className="py-5"><p>Loading...</p></Container>;
  if (!user) return <Container className="py-5"><p>Please log in to view your profile.</p></Container>;

  return (
    <Container className="py-5">
      <h2>Profile</h2>
      <Row className="g-4">
        <Col md={4} className="text-center">
          <img src={profilePic} alt="Profile" className="img-fluid rounded-circle" style={{ maxWidth: '150px' }} />
        </Col>
        <Col md={8}>
          <h3>{user.username}</h3>
          <p>{user.bio || 'No bio available.'}</p>
          <h5>Skills Offered</h5>
          <ul>
            {userSkills.length > 0 ? (
              userSkills.map(skill => <li key={skill.skill_id}>{skill.title}</li>)
            ) : (
              <li>No skills listed.</li>
            )}
          </ul>
          <h5>Sessions</h5>
          {userSessions.length > 0 ? (
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Skill ID</th>
                  <th>Scheduled</th>
                  <th>Role</th>
                  <th>Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userSessions.map(session => {
                  const isPast = new Date(session.scheduled_at) < new Date();
                  const isRated = session.rating !== null && session.rating !== undefined;
                  const isLearner = session.learner_id === user.id;
                  console.log(`Session ${session.id}: isPast=${isPast}, isRated=${isRated}, isLearner=${isLearner}, scheduled_at=${session.scheduled_at}`);
                  return (
                    <tr key={session.id}>
                      <td>{session.skill_id}</td>
                      <td>{new Date(session.scheduled_at).toLocaleString()}</td>
                      <td>{session.teacher_id === user.id ? 'Teacher' : 'Learner'}</td>
                      <td>{isRated ? <strong>{session.rating}</strong> : <em>Not rated</em>}</td>
                      <td>
                        {isPast && isLearner && (
                          <Form
                            inline
                            className="d-flex align-items-center"
                            onSubmit={e => {
                              e.preventDefault();
                              handleRateSession(session.id, isRated);
                            }}
                          >
                            <Form.Select
                              size="sm"
                              style={{ width: '100px', marginRight: '8px' }}
                              value={ratingInputs[session.id] || (isRated ? session.rating.toString() : '')}
                              onChange={e => handleRatingChange(session.id, e.target.value)}
                              required
                            >
                              <option value="">Select rating</option>
                              {[1, 2, 3, 4, 5].map(n => (
                                <option key={n} value={n}>{n}</option>
                              ))}
                            </Form.Select>
                            <Button
                              type="submit"
                              size="sm"
                              variant={isRated ? 'warning' : 'primary'}
                              disabled={!ratingInputs[session.id]}
                            >
                              {isRated ? 'Update' : 'Rate'}
                            </Button>
                          </Form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <p>No sessions found.</p>
          )}
          {ratingError && <Alert variant="danger" className="mt-3">{ratingError}</Alert>}
          {ratingSuccess && <Alert variant="success" className="mt-3">{ratingSuccess}</Alert>}
          <Button
            variant="outline-primary"
            onClick={() => setShowEdit(!showEdit)}
            className="mt-3"
          >
            {showEdit ? 'Close Edit Profile' : 'Edit Profile'}
          </Button>
          {showEdit && (
            <Form onSubmit={handleEditSubmit} className="mt-3">
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control name="username" value={editData.username} onChange={handleEditChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" type="email" value={editData.email} onChange={handleEditChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  name="bio"
                  as="textarea"
                  rows={3}
                  value={editData.bio}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="me-2">Save</Button>
              <Button
                variant="secondary"
                onClick={() => setShowEdit(false)}
              >
                Cancel
              </Button>
              {editError && <Alert variant="danger" className="mt-3">{editError}</Alert>}
              {editSuccess && <Alert variant="success" className="mt-3">{editSuccess}</Alert>}
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;