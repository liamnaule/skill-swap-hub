import { useContext, useMemo, useState, useEffect } from 'react';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SkillCard from '../components/SkillCard';
import { SkillsContext } from '../context/SkillsContext';
import { AuthContext } from '../context/AuthContext';

function SkillList() {
  const { skills, loading, error } = useContext(SkillsContext);
  const { user, loading: authLoading } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const filteredSkills = useMemo(
    () =>
      skills.filter((skill) =>
        skill.title.toLowerCase().includes(search.toLowerCase())
      ),
    [skills, search]
  );

  if (loading || authLoading)
    return <Container className="py-5"><p>Loading...</p></Container>;
  if (error)
    return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="py-5">
      <h2 className="mb-4">Browse Skills</h2>
      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form.Group>
      <Row xs={1} sm={2} md={3} className="g-4">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill) => (
            <Col key={skill.id}>
              <SkillCard skill={skill} />
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">No skills found.</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default SkillList;