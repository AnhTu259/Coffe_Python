import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
  const name = localStorage.getItem('user_name') || 'Khách';
  const email = localStorage.getItem('user_email') || 'Chưa cập nhật';

  if (!isLoggedIn) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>Chưa đăng nhập</h2>
          <p>Vui lòng đăng nhập để xem thông tin cá nhân.</p>
          <button className="profile-btn" onClick={() => navigate('/login')}>Đăng nhập</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <img src="/images/avatar.png" alt="avatar" className="profile-avatar" />
          <div>
            <h2>{name}</h2>
            <p>{email}</p>
          </div>
        </div>
        <div className="profile-section">
          <h3>Thông tin cá nhân</h3>
          <div className="profile-row">
            <span>Họ tên</span>
            <strong>{name}</strong>
          </div>
          <div className="profile-row">
            <span>Email</span>
            <strong>{email}</strong>
          </div>
          <div className="profile-row">
            <span>Trạng thái</span>
            <strong>Khách hàng</strong>
          </div>
        </div>
        <button className="profile-btn secondary" onClick={() => navigate('/')}>Về trang chủ</button>
      </div>
    </div>
  );
}

export default Profile;
