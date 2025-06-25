import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SkillsProvider } from './context/SkillsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SkillList from './pages/SkillList';
import SkillPost from './pages/SkillPost';
import Login from './pages/login';
import Profile from './pages/Profile';
import Booking from './pages/Booking';
import AdminDashboard from './pages/AdminDashboard';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/skills" element={<SkillList />} />
      <Route path="/post-skill" element={<SkillPost />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/book/:skillId" element={<Booking />} />
      <Route
        path="/admin"
        element={
          loading ? (
            <div className="container py-5"><p>Loading...</p></div>
          ) : user && user.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <div className="container py-5">
              <h2>Access denied. Admins only.</h2>
            </div>
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SkillsProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </SkillsProvider>
    </AuthProvider>
  );
}

export default App;