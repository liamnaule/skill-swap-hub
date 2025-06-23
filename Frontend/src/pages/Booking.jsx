import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Form, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { SkillsContext } from '../context/SkillsContext';

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

  const skill = skills.find(s => s.id === parseInt(skillId));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!skill) {
      setError('Skill not found');
      return;
    }
    try {
      // Replacing with API call 
      console.log(`Booking skill ${skillId} for ${date}`);
      setSuccess(true);
      setDate('');
    } catch (err) {
      setError('Failed to book session');
    }
  };

  if (skillsLoading) return <Container className="py-5"><p>Loading...</p></Container>;
  if (skillsError) return <Container className="py-5"><Alert variant="danger">{skillsError}</Alert></Container>;
  if (!skill) return <Container className="py-5"><Alert variant="danger">Skill not found</Alert></Container>;

  return (
    <Container className="py-5">
      <h2>Book a Session</h2>
      <h4>{skill.title}</h4>
      <p className="text-muted">Offered by {skill.user.name}</p>
      {success && <Alert variant="success">Session booked successfully!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="w-100 w-md-75 mx-auto login-form">
        <Form.Group className="mb-3">
          <Form.Label>Select Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">
          Confirm Booking
        </Button>
      </Form>
      <p className="mt-3 text-muted">
        Note: Calendar integration (e.g., react-date-picker) can be added.
      </p>
    </Container>
  );
}

export default Booking;