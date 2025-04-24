import { createContext, useState, useEffect } from 'react';
import api, { login, logout, getCurrentUser } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      // console.log(">> getCurrentUser")
      const response = await getCurrentUser();
      setUser(response.data);
      // console.log(">> Fetched user:", response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      handleLogout();
    }
    setLoading(false);
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);
      // console.log(">> call login api")
      const newToken = response.data.access_token;
      // console.log(">> Set token")
      setToken(newToken);
      localStorage.setItem('token', newToken);
      await fetchUser();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    if (token) {
      // console.log(">> Setting token in header")
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      // api.headers['Authorization'] = `Bearer ${token}`;
      // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      // console.log(">> No token found")
      setLoading(false);
    }
  }, [token, loading]);

  return (
    <AuthContext.Provider value={{ user, token, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};