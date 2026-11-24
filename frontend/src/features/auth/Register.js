import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as apiRegister, login as apiLogin } from '../../services/api';
import './AuthForm.css';

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // toggle mật khẩu
  const [showConfirm, setShowConfirm] = useState(false); // toggle xác nhận

  // Regex kiểm tra độ mạnh của mật khẩu
  const passwordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!passwordStrong.test(password)) {
      setError('Mật khẩu phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số!');
      return;
    }

    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      await apiRegister(username, password, email);
      const { access_token } = await apiLogin(username, password);
      localStorage.setItem('user_token', access_token);
      localStorage.setItem('user_name', username);
      navigate('/');
    } catch (e) {
      const detail = e?.response?.data?.detail;
      setError(detail ? `Đăng ký thất bại: ${detail}` : 'Đăng ký thất bại. Vui lòng thử lại.');
      console.error('Register error:', e?.response?.data || e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2>Đăng ký</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={submit}>
          {/* Email */}
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          {/* Tên đăng nhập */}
          <div className="form-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="username">Tên đăng nhập</label>
          </div>

          {/* Mật khẩu */}
          <div className="form-group password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="password">Mật khẩu</label>
            <span
              className="toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Ẩn mật khẩu 😏' : 'Hiện mật khẩu 🤪'}
            >
              {showPassword ? '🙈' : '👀'}
            </span>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="form-group password-field">
            <input
              type={showConfirm ? 'text' : 'password'}
              id="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="confirm">Xác nhận mật khẩu</label>
            <span
              className="toggle-icon"
              onClick={() => setShowConfirm(!showConfirm)}
              title={showConfirm ? 'Ẩn lại 😅' : 'Xem thử 😜'}
            >
              {showConfirm ? '🙈' : '👀'}
            </span>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <div className="auth-links">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
