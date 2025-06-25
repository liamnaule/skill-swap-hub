import { useContext, useEffect, useState } from 'react';
import { Container, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import profilePic from '../assets/profile-placeholder.png'; 

function Profile() {
  const { user, loading, setUser } = useContext(AuthContext);
  const [userSkills, setUserSkills] = useState([]);
  const [userSessions, setUserSessions] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({ username: user?.username || '', email: user?.email || '' });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [ratingInputs, setRatingInputs] = useState({});
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');
  const [showRateForm, setShowRateForm] = useState({}); // Track which session's rate form is open

  useEffect(() => {
    if (user) {
      setEditData({ username: user.username, email: user.email });
      const fetchUserSkills = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/skills/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setUserSkills(res.data.filter(skill => skill.user_id === user.id));
        } catch (err) {
          console.error('Failed to fetch skills:', err.response?.data?.error || err.message);
        }
      };
      const fetchUserSessions = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/sessions/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          // Show sessions where user is teacher or learner
          setUserSessions(res.data.filter(
            session => session.teacher_id === user.id || session.learner_id === user.id
          ));
        } catch (err) {
          console.error('Failed to fetch sessions:', err.response?.data?.error || err.message);
        }
      };
      fetchUserSkills();
      fetchUserSessions();
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
      await axios.patch(`${import.meta.env.VITE_API_URL}/users/${user.id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditSuccess('Profile updated!');
      setShowEdit(false);
      setUser(prev => ({ ...prev, username: editData.username, email: editData.email }));
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleRatingChange = (sessionId, value) => {
    setRatingInputs({ ...ratingInputs, [sessionId]: value });
  };

  const handleRateSession = async (sessionId) => {
    setRatingError('');
    setRatingSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/ratings/`,
        { session_id: sessionId, rating: Number(ratingInputs[sessionId]) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserSessions(userSessions.map(s =>
        s.id === sessionId ? { ...s, rating: Number(ratingInputs[sessionId]) } : s
      ));
      setRatingSuccess('Session rated!');
    } catch (err) {
      setRatingError(err.response?.data?.error || 'Failed to rate session');
    }
  };

  const handleShowRateForm = (sessionId) => {
    setShowRateForm({ ...showRateForm, [sessionId]: true });
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
          <h5>Sessions</h5>
          <ul>
            {userSessions.length > 0 ? (
              userSessions.map(session => {
                const isPast = new Date(session.scheduled_at) < new Date();
                const isRated = session.rating !== null && session.rating !== undefined;
                return (
                  <li key={session.id} className="mb-2">
                    Skill ID: {session.skill_id} | Scheduled: {new Date(session.scheduled_at).toLocaleString()}
                    {isRated ? (
                      <> | Rating: <strong>{session.rating}</strong></>
                    ) : (
                      <> | Rating: <em>Not rated</em></>
                    )}
                    {/* Show "Rate" button if session is past and not rated */}
                    {isPast && !isRated && !showRateForm[session.id] && (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="ms-2"
                        onClick={() => handleShowRateForm(session.id)}
                      >
                        Rate
                      </Button>
                    )}
                    {/* Show rate form if requested */}
                    {isPast && !isRated && showRateForm[session.id] && (
                      <Form
                        inline="true"
                        className="d-inline ms-2"
                        onSubmit={e => {
                          e.preventDefault();
                          handleRateSession(session.id);
                        }}
                      >
                        <Form.Select
                          size="sm"
                          style={{ width: 'auto', display: 'inline-block' }}
                          value={ratingInputs[session.id] || ''}
                          onChange={e => handleRatingChange(session.id, e.target.value)}
                          required
                        >
                          <option value="">Select rating</option>
                          {[1, 2, 3, 4, 5].map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </Form.Select>
                        <Button type="submit" size="sm" className="ms-1">Submit</Button>
                      </Form>
                    )}
                  </li>
                );
              })
            ) : (
              <li>No sessions found.</li>
            )}
          </ul>
          {ratingError && <Alert variant="danger">{ratingError}</Alert>}
          {ratingSuccess && <Alert variant="success">{ratingSuccess}</Alert>}
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