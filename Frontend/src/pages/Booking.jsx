import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Form, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { SkillsContext } from '../context/SkillsContext';
import axios from 'axios';

function Booking() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { skills, loading: skillsLoading, error: skillsError } = useContext(SkillsContext);
  const [date, setDate] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user && !skillsLoading) {
      navigate('/login');
    }
  }, [user, skillsLoading, navigate]);

  const skill = skills.find((s) => String(s.skill_id) === String(skillId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skill) {
      setError('Skill not found');
      return;
    }
    try {
      await axios.post(
        'http://127.0.0.1:5000/sessions/',
        {
          skill_id: skill.skill_id,
          teacher_id: skill.user_id,
          learner_id: user.id,
          scheduled_at: new Date(date).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSuccess(true);
      setDate('');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book session');
    }
  };

  if (skillsLoading)
    return <Container className="py-5"><p>Loading...</p></Container>;
  if (skillsError)
    return <Container className="py-5"><Alert variant="danger">{skillsError}</Alert></Container>;
  if (!skill)
    return <Container className="py-5"><Alert variant="danger">Skill not found</Alert></Container>;

  return (
    <Container className="py-5">
      <h2>Book a Session</h2>
      <h4>{skill.title}</h4>
      <p className="text-muted">Offered by User ID: {skill.user_id}</p>
      {success && <Alert variant="success">Session booked successfully!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="w-100 w-md-75 mx-auto login-form">
        <Form.Group className="mb-3">
          <Form.Label>Select Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">
          Confirm Booking
        </Button>
      </Form>
    </Container>
  );
}

export default Booking;