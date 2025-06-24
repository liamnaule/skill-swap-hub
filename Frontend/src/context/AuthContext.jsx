import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Persist token in localStorage
  const getToken = () => localStorage.getItem('token');
  const setToken = (token) => localStorage.setItem('token', token);
  const removeToken = () => localStorage.removeItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('http://127.0.0.1:5000/auth/current_user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser({
          id: res.data.id,
          name: res.data.username,
          email: res.data.email,
          role: res.data.is_admin ? 'admin' : 'user',
        });
      } catch (error) {
        setUser(null);
        removeToken();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const res = await axios.post('http://127.0.0.1:5000/auth/login', credentials);
    setToken(res.data.access_token);
    setUser({
      id: res.data.user.id,
      name: res.data.user.username,
      email: res.data.user.email,
      role: res.data.user.is_admin ? 'admin' : 'user',
    });
  };

  const logout = async () => {
    const token = getToken();
    if (token) {
      try {
        await axios.delete('http://127.0.0.1:5000/auth/logout', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {}
      removeToken();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};