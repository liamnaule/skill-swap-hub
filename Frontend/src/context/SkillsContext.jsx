import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SkillsContext = createContext();

export const SkillsProvider = ({ children }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // Replacing with API call 
        const mockSkills = [
          { id: 1, title: 'Learn Python', description: 'Beginner-friendly Python lessons.', user: { name: 'Alice' }, image: 'https://via.placeholder.com/300x200' },
          { id: 2, title: 'Guitar Lessons', description: 'Master the guitar basics.', user: { name: 'Bob' }, image: 'https://via.placeholder.com/300x200' },
        ];
        setSkills(mockSkills);
      } catch (err) {
        setError('Failed to fetch skills');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const addSkill = async (skillData) => {
    try {
      // Replacing with API call 
      const newSkill = {
        id: skills.length + 1,
        title: skillData.title,
        description: skillData.description,
        user: { name: 'Current User' }, // Replacing with real user from AuthContext
        image: skillData.image || '',
      };
      setSkills([...skills, newSkill]);
      return true;
    } catch (err) {
      setError('Failed to add skill');
      return false;
    }
  };

  return (
    <SkillsContext.Provider value={{ skills, loading, error, addSkill }}>
      {children}
    </SkillsContext.Provider>
  );
};