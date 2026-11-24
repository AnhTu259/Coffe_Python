import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { login as apiLogin } from './api';
import Dashboard from './Dashboard';

// Simple login screen that stores the issued JWT token for later API calls
function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tự động đăng nhập nếu có token trong localStorage
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  // Submit credentials and redirect to the dashboard once authenticated
  const submit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const { access_token } = await apiLogin(username, password);
      localStorage.setItem('admin_token', access_token);
      localStorage.setItem('admin_name', username);
      navigate('/');
    } catch (err) {
      setError('Đăng nhập thất bại, vui lòng kiểm tra lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={submit}>
        <div>
          <p className="auth-kicker">DazzyCoffee</p>
          <h2>Đăng nhập Admin</h2>
          
        </div>
        {error && <div className="alert error">{error}</div>}
        <label className="field">
          <span>Tài khoản</span>
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="admin" required />
        </label>
        <label className="field">
          <span>Mật khẩu</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••" required />
        </label>
        <button type="submit" className="btn primary" disabled={isSubmitting}>
          {isSubmitting ? 'Đang xử lý…' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}

// Guard component that blocks access when the token is missing
function RequireAuth({ children }) {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={(
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        )}
      />
    </Routes>
  );
}
