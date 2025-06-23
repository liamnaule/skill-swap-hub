import { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import SkillCard from '../components/SkillCard';
import axios from 'axios';

// Mock data
const mockSkills = [
  { id: 1, title: 'Learn Python', description: 'Beginner-friendly Python lessons.', user: { name: 'Alice' }, image: 'https://via.placeholder.com/300x200' },
  { id: 2, title: 'Guitar Lessons', description: 'Master the guitar basics.', user: { name: 'Bob' }, image: 'https://via.placeholder.com/300x200' },
];

function SkillList() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Replacing with API call
    setSkills(mockSkills);
  }, []);

  const filteredSkills = useMemo(() =>
    skills.filter(skill =>
      skill.title.toLowerCase().includes(search.toLowerCase())
    ),
    [skills, search]
  );

  return (
    <Container className="py-5">
      <h2 className="mb-4">Browse Skills</h2>
      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </Form.Group>
      <Row xs={1} sm={2} md={3} className="g-4">
        {filteredSkills.map(skill => (
          <Col key={skill.id}>
            <SkillCard skill={skill} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default SkillList;