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

function App() {
  return (
    <AuthProvider>
      <SkillsProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/skills" element={<SkillList />} />
              <Route path="/post-skill" element={<SkillPost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/book/:skillId" element={<Booking />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SkillsProvider>
    </AuthProvider>
  );
}

export default App;