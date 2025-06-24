import { useState, useContext } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { SkillsContext } from '../context/SkillsContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function SkillPost() {
  const [formData, setFormData] = useState({ title: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { addSkill } = useContext(SkillsContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!user) {
      setError('You must be logged in to post a skill.');
      navigate('/login');
      return;
    }
    const skillData = {
      user_id: user.id,
      title: formData.title,
      is_offered: true,
      is_approved: false,
    };
    const ok = await addSkill(skillData);
    if (ok) {
      setSuccess(true);
      setFormData({ title: '' });
      setTimeout(() => navigate('/skills'), 2000);
    } else {
      setError('Error posting skill.');
    }
  };

  return (
    <Container className="py-5">
      <h2>Post a New Skill</h2>
      {success && <Alert variant="success">Skill posted successfully!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Post Skill
        </Button>
      </Form>
    </Container>
  );
}

export default SkillPost;