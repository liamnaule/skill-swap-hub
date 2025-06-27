import { useState, useContext } from 'react'; 
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom'; 

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const success = await login(formData);
    if (success) {
      const redirectTo = location.state?.from?.pathname || '/profile';
      navigate(redirectTo, { replace: true });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Container className="py-5">
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="w-100 w-md-75 mx-auto login-form">
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">
          Login
        </Button>
        <div className="text-center mt-3">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </Form>
    </Container>
  );
}

export default Login;
