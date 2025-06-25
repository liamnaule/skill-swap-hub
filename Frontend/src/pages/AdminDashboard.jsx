import { useContext, useEffect, useState } from 'react';
import { Container, Alert, Table, Button, Form, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [reports, setReports] = useState([]);
  const [regForm, setRegForm] = useState({ username: '', email: '', password: '' });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    } else if (!loading && user.role === 'admin') {
      fetchAdminData();
    }
    // eslint-disable-next-line
  }, [user, loading, navigate]);

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [usersRes, skillsRes, reportsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/users/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${import.meta.env.VITE_API_URL}/skills/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${import.meta.env.VITE_API_URL}/reports/`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setUsers(usersRes.data);
      setSkills(skillsRes.data);
      setReports(reportsRes.data);
    } catch (err) {
      console.error('Fetch admin data error:', err.response?.data || err.message);
    }
  };

  const updateSkillApproval = async (skillId, isApproved) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/skills/${skillId}`,
        { is_approved: isApproved },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSkills(skills.map(s => s.skill_id === skillId ? { ...s, is_approved: isApproved } : s));
    } catch (err) {
      console.error('Skill approval error:', err.response?.data || err.message);
    }
  };

  // Register user
  const handleRegChange = (e) => {
    setRegForm({ ...regForm, [e.target.name]: e.target.value });
  };

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/`, regForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegSuccess('User registered successfully!');
      setRegForm({ username: '', email: '', password: '' });
      fetchAdminData(); // Refresh user list
    } catch (err) {
      setRegError(err.response?.data?.error || 'Registration failed');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const toggleBlockUser = async (userId, isBlocked) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        { is_blocked: !isBlocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(u => u.id === userId ? { ...u, is_blocked: !isBlocked } : u));
    } catch (err) {
      alert('Failed to update user block status');
    }
  };

  // Delete report
  const handleDeleteReport = async (reportId) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Delete this report?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(reports.filter(r => r.id !== reportId));
    } catch (err) {
      alert('Failed to delete report');
    }
  };

  // Helper functions to get usernames and skill titles
  const getUsername = (userId) => {
    const u = users.find(user => user.id === userId);
    return u ? u.username : userId || 'N/A';
  };
  const getSkillTitle = (skillId) => {
    const s = skills.find(skill => skill.skill_id === skillId);
    return s ? s.title : skillId || 'N/A';
  };

  if (loading) {
    return <Container className="py-5 text-center"><div>Loading...</div></Container>;
  }

  return (
    <Container className="py-5">
      <h2>Admin Dashboard</h2>
      <Alert variant="info">Welcome, {user?.username || 'Admin'}!</Alert>

      {/* User Registration Form */}
      <h3>Register New User</h3>
      <Form onSubmit={handleRegSubmit} className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Control
              name="username"
              placeholder="Username"
              value={regForm.username}
              onChange={handleRegChange}
              required
            />
          </Col>
          <Col md={4}>
            <Form.Control
              name="email"
              type="email"
              placeholder="Email"
              value={regForm.email}
              onChange={handleRegChange}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              value={regForm.password}
              onChange={handleRegChange}
              required
            />
          </Col>
          <Col md={2}>
            <Button type="submit" variant="primary" className="w-100">
              Register
            </Button>
          </Col>
        </Row>
        {regError && <Alert variant="danger" className="mt-2">{regError}</Alert>}
        {regSuccess && <Alert variant="success" className="mt-2">{regSuccess}</Alert>}
      </Form>

      <h3>Manage Users</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Blocked</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.is_admin ? 'Yes' : 'No'}</td>
              <td>{u.is_blocked ? 'Yes' : 'No'}</td>
              <td>
                <Button
                  variant={u.is_blocked ? "success" : "warning"}
                  size="sm"
                  onClick={() => toggleBlockUser(u.id, u.is_blocked)}
                  className="me-2"
                  disabled={u.id === user.id}
                >
                  {u.is_blocked ? "Unblock" : "Block"}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteUser(u.id)}
                  disabled={u.id === user.id}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Pending Skills</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>User</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {skills.map(s => (
            <tr key={s.skill_id}>
              <td>{s.skill_id}</td>
              <td>{s.title}</td>
              <td>{getUsername(s.user_id)}</td>
              <td>
                {!s.is_approved ? (
                  <Button variant="success" onClick={() => updateSkillApproval(s.skill_id, true)}>
                    Approve
                  </Button>
                ) : (
                  <Button variant="warning" onClick={() => updateSkillApproval(s.skill_id, false)}>
                    Disapprove
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Reports</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Reporter</th>
            <th>Reported User</th>
            <th>Reported Skill</th>
            <th>Reason</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{getUsername(r.reporter_id)}</td>
              <td>{r.reported_user_id ? getUsername(r.reported_user_id) : 'N/A'}</td>
              <td>{r.reported_skill_id ? getSkillTitle(r.reported_skill_id) : 'N/A'}</td>
              <td>{r.reason}</td>
              <td>{r.created_at ? new Date(r.created_at).toLocaleString() : 'N/A'}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDeleteReport(r.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminDashboard;