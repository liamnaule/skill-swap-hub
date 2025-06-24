import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SkillCard = ({ skill }) => {
  const [userName, setUserName] = useState('Unknown');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get(`http://127.0.0.1:5000/users/${skill.user_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserName(res.data.username);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err.response?.data?.error || err.message);
      }
    };
    fetchUser();
  }, [skill.user_id]);

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title>{skill.title}</Card.Title>
        <Card.Text>
          <strong>Offered by:</strong> {userName}<br />
          <strong>Status:</strong> {skill.is_approved ? 'Approved' : 'Pending Approval'}<br />
          <strong>Offered:</strong> {skill.is_offered ? 'Available' : 'Not Available'}<br />
          <strong>Posted:</strong>{' '}
          {new Date(skill.created_at).toLocaleString('en-US', {
            timeZone: 'Africa/Nairobi',
          })}
        </Card.Text>
        {skill.is_approved && skill.is_offered && (
          <Button as={Link} to={`/book/${skill.id}`} variant="primary">
            Book Session
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default SkillCard;