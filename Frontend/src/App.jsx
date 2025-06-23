import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SkillList from './pages/SkillList';
import SkillPost from './pages/SkillPost';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<SkillList />} />
          <Route path="/post-skill" element={<SkillPost />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;