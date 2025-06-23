import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';

function SkillCard({ skill }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = skill.image || '';
    img.onload = () => setImageLoaded(true);
  }, [skill.image]);

  return (
    <Card className="h-100 shadow-sm">
      <img
        src={skill.image || ''}
        alt={skill.title}
        className={`card-img-top lazy-load ${imageLoaded ? 'loaded' : ''}`}
      />
      <Card.Body>
        <Card.Title>{skill.title}</Card.Title>
        <Card.Text>{skill.description.slice(0, 100)}...</Card.Text>
        <Card.Text>
          <small className="text-muted">By {skill.user.name}</small>
        </Card.Text>
        <Button as={Link} to={`/book/${skill.id}`} variant="primary">
          Book Session
        </Button>
      </Card.Body>
    </Card>
  );
}

export default SkillCard;