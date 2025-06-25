import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem('token');
  const setToken = (token) => localStorage.setItem('token', token);
  const removeToken = () => localStorage.removeItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/current_user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser({
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          role: res.data.is_admin ? 'admin' : 'user',
        });
      } catch (error) {
        console.error('Fetch user error:', error.response?.data || error.message);
        setUser(null);
        removeToken();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials);
      setToken(res.data.access_token);
      setUser({
        id: res.data.user.id,
        username: res.data.user.username,
        email: res.data.user.email,
        role: res.data.user.is_admin ? 'admin' : 'user',
      });
      return true;
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      return false;
    }
  };

  const logout = async () => {
    const token = getToken();
    if (token) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/auth/logout`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.error('Logout error:', e.response?.data || e.message);
      }
      removeToken();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};