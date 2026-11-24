import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import SearchBar from '../SearchBar/SearchBar';

/**
 * Component Header hiển thị thanh điều hướng chính của ứng dụng.
 * Bao gồm logo, các liên kết điều hướng, thanh tìm kiếm, nút giỏ hàng và các tùy chọn đăng nhập/đăng ký/đăng xuất.
 * Nó cũng xử lý trạng thái cuộn của trang và menu di động.
 */
function Header({ cartItemsCount, onCartClick, onSearch }) {
  const navigate = useNavigate(); // Hook để điều hướng chương trình
  const location = useLocation(); // Hook để lấy thông tin vị trí hiện tại
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Trạng thái quản lý việc mở/đóng menu di động
  const [isScrolled, setIsScrolled] = useState(false); // Trạng thái theo dõi việc cuộn trang
  const [isMobileView, setIsMobileView] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 968;
    }
    return false;
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  
  const logoSrc = `${process.env.PUBLIC_URL || ''}/imge/logocatnen.png`; // Đường dẫn động đến logo
  const loaderSrc = `${process.env.PUBLIC_URL || ''}/imge/loader.png`; // Đường dẫn động đến hình ảnh loader

  const isLoggedIn = localStorage.getItem("is_logged_in") === "true";
  const userName = localStorage.getItem("user_name");

  // useEffect để xử lý hiệu ứng cuộn trang, thay đổi kiểu header khi cuộn
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Đặt isScrolled nếu cuộn quá 50px
    };
    window.addEventListener('scroll', handleScroll); // Thêm trình nghe sự kiện cuộn
    return () => window.removeEventListener('scroll', handleScroll); // Dọn dẹp trình nghe sự kiện khi component unmount
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 968);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Đóng menu profile khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Xử lý việc nhấp vào các liên kết điều hướng.
   * Nếu đang ở trang khác, điều hướng về trang chủ trước rồi cuộn đến phần tương ứng.
   * Nếu đang ở trang chủ, cuộn trực tiếp đến phần tương ứng.
   */
  const handleNavClick = (e, sectionId) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
    setIsMobileMenuOpen(false); // Đóng menu di động khi nhấp vào liên kết
    
    // Nếu đang ở trang khác, điều hướng về trang chủ trước
    if (location.pathname !== '/') {
      navigate('/');
      // Đợi một chút để trang chủ load xong rồi cuộn
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Nếu đang ở trang chủ, cuộn trực tiếp
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  /**
   * Xử lý việc nhấp vào logo.
   * Nếu đang ở trang khác, điều hướng về trang chủ. Nếu đang ở trang chủ, cuộn lên đầu trang.
   */
  const handleLogoClick = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
    setIsMobileMenuOpen(false); // Đóng menu di động
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang
    }
  };

  /**
   * Chuyển đổi trạng thái mở/đóng của menu di động.
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  /**
   * Xử lý đăng xuất người dùng.
   * Xóa token và tên người dùng khỏi localStorage, đặt lại userName và điều hướng về trang chủ.
   */
  const logout = () => {
    localStorage.clear(); // Xóa tất cả dữ liệu trong localStorage
    setShowProfileMenu(false);
    // Force a reload to update the header state
    window.location.reload();
  };

  return (
    // Header chính của trang, áp dụng class 'scrolled' khi cuộn
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container"> {/* Container chứa nội dung header */}
        {/* Logo và tên cửa hàng */}
        <Link to="/imge/logocatnen.png" className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logoSrc} alt="DazzyCoffee Logo" className="logo-image" />
          <span className="logo-text">DazzyCoffee</span>
        </Link>
        
        {/* Thanh điều hướng chính */}
        <nav className={`nav ${isMobileMenuOpen ? 'active' : ''}`}> {/* Áp dụng class 'active' khi menu di động mở */}
          {isMobileView && (
            <div className="nav-mobile-search">
              <SearchBar onSearch={onSearch} />
            </div>
          )}
          <Link to="/" className="nav-link" onClick={(e) => { handleNavClick(e, 'home'); setIsMobileMenuOpen(false); }}>Home</Link>
          <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, 'about')}>About</a>
          <a href="#menu" className="nav-link" onClick={(e) => handleNavClick(e, 'menu')}>Menu</a>
          <Link to="/products" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
          <a href="#review" className="nav-link" onClick={(e) => handleNavClick(e, 'review')}>Review</a>
          <a href="#contact" className="nav-link" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
          <a href="#blogs" className="nav-link" onClick={(e) => handleNavClick(e, 'blogs')}>Blogs</a>
          {/* Admin/Kho tách sang web riêng */}
        </nav>
        
        {/* Các hành động của header: tìm kiếm, giỏ hàng, đăng nhập/đăng ký/đăng xuất */}
        <div className="header-actions">
          {!isMobileView && <SearchBar onSearch={onSearch} />} {/* Desktop search */}
          {/* Nút giỏ hàng */}
          <button className="cart-button" onClick={onCartClick} title="Shopping Cart">
            <i className="fas fa-shopping-cart cart-icon" aria-hidden="true"></i>
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </button>
          {/* Hiển thị tùy chọn đăng nhập/đăng ký hoặc tên người dùng/đăng xuất */}
          {isLoggedIn ? (
            <div className="header-avatar" ref={profileRef}>
              <button className="avatar-button" onClick={toggleProfileMenu} aria-label="Hồ sơ cá nhân">
                <img src="/images/avatar.png" alt="avatar" className="avatar-img" />
              </button>
              {showProfileMenu && (
                <div className="profile-menu">
                  <div className="profile-menu-header">{userName || 'Khách'}</div>
                  <Link className="profile-menu-item" to="/profile" onClick={() => setShowProfileMenu(false)}>
                    <i className="fas fa-user"></i> Hồ sơ cá nhân
                  </Link>
                  <button className="profile-menu-item danger" type="button" onClick={logout}>
                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-link">Đăng nhập</Link>
              <Link to="/register" className="auth-link">Đăng ký</Link>
            </div>
          )}
          {/* Nút chuyển đổi menu di động */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
            <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}> {/* Áp dụng class 'active' cho hiệu ứng hamburger */}
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
      
      {/* Lớp phủ menu di động, hiển thị khi menu mở */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu} style={{ opacity: 1, pointerEvents: 'all' }}></div>
      )}
    </header>
  );
}

export default Header;





