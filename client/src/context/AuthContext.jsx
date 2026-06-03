import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getProfile } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('expense_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('expense_token'));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !user) {
      getProfile()
        .then((response) => setUser(response.data))
        .catch(() => logout());
    }
  }, [token]);

  const saveAuth = (tokenValue, userValue) => {
    localStorage.setItem('expense_token', tokenValue);
    localStorage.setItem('expense_user', JSON.stringify(userValue));
    setToken(tokenValue);
    setUser(userValue);
  };

  const logout = () => {
    localStorage.removeItem('expense_token');
    localStorage.removeItem('expense_user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const login = async (credentials) => {
    setLoading(true);
    const response = await loginUser(credentials);
    saveAuth(response.data.token, response.data.user);
    setLoading(false);
    navigate('/dashboard');
  };

  const register = async (payload) => {
    setLoading(true);
    const response = await registerUser(payload);
    saveAuth(response.data.token, response.data.user);
    setLoading(false);
    navigate('/dashboard');
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout, setUser }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
