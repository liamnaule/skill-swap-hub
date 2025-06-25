import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import profilePic from '../assets/profile-placeholder.png';

const SkillCard = ({ skill, onReport }) => {
  const [userName, setUserName] = useState('Unknown');
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get(`http://127.0.0.1:5000/users/${skill.user_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserName(res.data.username);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err.response?.data?.error || err.message);
      }
    };
    fetchUser();
  }, [skill.user_id]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://127.0.0.1:5000/reports/',
        { reported_skill_id: skill.skill_id, reason: reportReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReportSuccess(true);
      setShowReport(false);
      setReportReason('');
      setTimeout(() => setReportSuccess(false), 2000);
    } catch (err) {
      setReportError(err.response?.data?.error || 'Failed to submit report');
    }
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <img src={profilePic} alt="User" className="profile-img me-3" />
          <div>
            <Card.Title className="m-0">{skill.title}</Card.Title>
            <small className="text-muted">
              Offered by: {userName} | Status: {skill.is_approved ? 'Approved' : 'Pending Approval'} | Offered: {skill.is_offered ? 'Available' : 'Not Available'}
            </small>
          </div>
        </div>
        <Card.Text>
          <strong>Posted:</strong>{' '}
          {new Date(skill.created_at).toLocaleString('en-US', { timeZone: 'Africa/Nairobi' })}
        </Card.Text>
        {skill.is_approved && skill.is_offered && (
          <Button as={Link} to={`/book/${skill.skill_id}`} variant="primary" className="me-2">
            Book Session
          </Button>
        )}
        <Button variant="outline-danger" onClick={() => setShowReport(!showReport)}>
          Report
        </Button>
        {showReport && (
          <Form onSubmit={handleReportSubmit} className="mt-3">
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Reason for reporting"
                required
              />
            </Form.Group>
            <Button type="submit" variant="danger" className="mt-2">
              Submit Report
            </Button>
          </Form>
        )}
        {reportSuccess && <Alert variant="success" className="mt-2">Report submitted!</Alert>}
        {reportError && <Alert variant="danger" className="mt-2">{reportError}</Alert>}
      </Card.Body>
    </Card>
  );
};

export default SkillCard;