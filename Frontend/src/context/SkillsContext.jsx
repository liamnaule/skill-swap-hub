import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const SkillsContext = createContext();

export const SkillsProvider = ({ children }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useContext(AuthContext);

  const API_URL = `${import.meta.env.VITE_API_URL}/skills/`;

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please log in to view skills');
        }
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setSkills(res.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch skills');
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading && user) {
      fetchSkills();
    } else if (!authLoading && !user) {
      setError('Please log in to view skills');
      setLoading(false);
    }
  }, [user, authLoading]);

  const addSkill = async (skillData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to add a skill');
      }
      const res = await axios.post(API_URL, skillData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
     
      setSkills((prev) => [...prev, res.data]);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add skill');
      return false;
    }
  };

  return (
    <SkillsContext.Provider value={{ skills, loading, error, addSkill }}>
      {children}
    </SkillsContext.Provider>
  );
};