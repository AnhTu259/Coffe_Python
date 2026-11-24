import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as apiLogin } from '../../services/api';
import './AuthForm.css'; // Import tệp CSS mới cho kiểu dáng hiện đại

/**
 * Component Login xử lý việc xác thực người dùng.
 * Nó cho phép người dùng đăng nhập bằng tên người dùng và mật khẩu của họ.
 * Sau khi đăng nhập thành công, nó lưu token và tên người dùng vào local storage và chuyển hướng đến trang chủ.
 */
function Login() {
  const navigate = useNavigate(); // Hook để điều hướng chương trình
  const [username, setUsername] = useState(''); // State cho trường nhập tên người dùng
  const [password, setPassword] = useState(''); // State cho trường nhập mật khẩu
  const [error, setError] = useState(null); // State để hiển thị thông báo lỗi
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái tải trong quá trình gọi API

  /**
   * Xử lý việc gửi biểu mẫu đăng nhập.
   * Ngăn chặn hành vi gửi biểu mẫu mặc định, gọi API đăng nhập,
   * và lưu dữ liệu người dùng khi thành công.
   */
  const submit = async (e) => {
    e.preventDefault(); // Ngăn chặn làm mới biểu mẫu mặc định
    setError(null); // Xóa các lỗi trước đó
    setLoading(true); // Đặt loading thành true trong quá trình gọi API
    try {
      // Gọi API đăng nhập
     const { access_token, username: returnedName } = await apiLogin(username, password);
      // Lưu token và tên người dùng vào local storage
     localStorage.setItem('user_token', access_token);// Lưu token người dùng
     localStorage.setItem('user_name', returnedName || username); // Sử dụng tên trả về từ API nếu có, nếu không thì dùng tên nhập vào
     localStorage.setItem('is_logged_in', "true"); // Đánh dấu trạng thái đã đăng nhập
     // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
     navigate('/');

      // Xử lý lỗi đăng nhập
      setError('Đăng nhập thất bại. Vui lòng kiểm tra thông tin.');
    } finally {
      setLoading(false); // Đặt lại trạng thái loading
    }
  };

  return (
    // Container chính cho trang xác thực, áp dụng kiểu dáng hiện đại
    <div className="auth-page-container">
      {/* Container dạng thẻ cho biểu mẫu đăng nhập */}
      <div className="auth-card">
        <h2>Đăng nhập</h2>
        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={submit}> {/* Biểu mẫu đăng nhập */}
          {/* Nhóm nhập tên người dùng với nhãn nổi */}
          <div className="form-group">
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder=" " // Placeholder rất quan trọng cho hiệu ứng nhãn nổi
              required
            />
            <label htmlFor="username">Tên đăng nhập</label>
          </div>
          {/* Nhóm nhập mật khẩu với nhãn nổi */}
          <div className="form-group">
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder=" " // Placeholder rất quan trọng cho hiệu ứng nhãn nổi
              required
            />
            <label htmlFor="password">Mật khẩu</label>
          </div>
          {/* Nút gửi để đăng nhập */}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
        {/* Liên kết đến trang đăng ký */}
        <div className="auth-links">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;