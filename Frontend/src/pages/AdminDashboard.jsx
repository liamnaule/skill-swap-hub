import { useContext, useEffect, useState } from 'react';
import { Container, Alert, Table, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [reports, setReports] = useState([]);

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
        axios.get('http://127.0.0.1:5000/users/', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://127.0.0.1:5000/skills/', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://127.0.0.1:5000/reports/', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setUsers(usersRes.data);
      setSkills(skillsRes.data);
      setReports(reportsRes.data);
    } catch (err) {
      console.error('Fetch admin data error:', err.response?.data || err.message);
    }
  };

  const approveSkill = async (skillId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://127.0.0.1:5000/skills/${skillId}`,
        { is_approved: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSkills(skills.map(s => s.skill_id === skillId ? { ...s, is_approved: true } : s));
    } catch (err) {
      console.error('Approve skill error:', err.response?.data || err.message);
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

      <h3>Manage Users</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Blocked</th>
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
          {skills.filter(s => !s.is_approved).map(s => (
            <tr key={s.skill_id}>
              <td>{s.skill_id}</td>
              <td>{s.title}</td>
              <td>{getUsername(s.user_id)}</td>
              <td>
                <Button variant="success" onClick={() => approveSkill(s.skill_id)}>
                  Approve
                </Button>
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
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminDashboard;