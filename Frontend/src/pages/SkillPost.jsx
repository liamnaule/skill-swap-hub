import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

function SkillPost() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Replacing with API call
      console.log('Skill posted:', formData);
      setSuccess(true);
      setFormData({ title: '', description: '', category: '' });
    } catch (error) {
      console.error('Error posting skill:', error);
    }
  };

  return (
    <Container className="py-5">
      <h2>Post a New Skill</h2>
      {success && <Alert variant="success">Skill posted successfully!</Alert>}
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
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="Coding">Coding</option>
            <option value="Music">Music</option>
            <option value="Cooking">Cooking</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit" variant="primary">
          Post Skill
        </Button>
      </Form>
    </Container>
  );
}

export default SkillPost;