import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext'; 

function AdminDashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Mock data for reported skills
  const reports = [
    { id: 1, skill: 'Inappropriate Post', user: 'User1', status: 'Pending' },
    { id: 2, skill: 'Spam', user: 'User2', status: 'Pending' },
  ];

  // Restrict access to admins
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <Container className="py-5"><p>Loading...</p></Container>;

  const handleAction = (reportId, action) => {
    // Replacing with API call 
    console.log(`${action} report ${reportId}`);
  };

  return (
    <Container className="py-5">
      <h2>Admin Dashboard</h2>
      {!user || user.role !== 'admin' ? (
        <Alert variant="danger">Access denied. Admins only.</Alert>
      ) : (
        <>
          <h3>Reported Content</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Skill</th>
                <th>User</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.skill}</td>
                  <td>{report.user}</td>
                  <td>{report.status}</td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleAction(report.id, 'Approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleAction(report.id, 'Reject')}
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
}

export default AdminDashboard;