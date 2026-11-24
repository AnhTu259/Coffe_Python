import React from 'react';
import './Footer.css';


function Footer() {
  return (
    <footer className="footer-tch">
      {/* 1. Phần nội dung chính (4 cột) */}
      <div className="footer-main">
        <div className="footer-container">
          
          {/* Cột 1: Giới thiệu */}
          <div className="footer-column">
            <h3>GIỚI THIỆU</h3>
            <a href="/#">Về Chúng Tôi</a>
            <a href="/#">Sản phẩm</a>
            <a href="/#">Khuyến mãi</a>
            <a href="/#">Chuyện cà phê</a>
            <a href="/#">Cửa Hàng</a>
            <a href="/#">Tuyển dụng</a>
          </div>

          {/* Cột 2: Điều khoản */}
          <div className="footer-column">
            <h3>ĐIỀU KHOẢN</h3>
            <a href="/#">Điều khoản sử dụng</a>
            <a href="/#">Chính sách bảo mật thông tin</a>
            <a href="/#">Hướng dẫn xuất hóa đơn GTGT</a>
          </div>

          {/* Cột 3: Liên hệ */}
          <div className="footer-column">
            <h3>© 2025 DazzyCoffee</h3>
            <p><strong>VPGG:</strong> Tầng 6, Toà nhà Toyota, Số 315 Trường Chinh, P. Khương Mai, Q. Thanh Xuân, TP. Hà Nội, Việt Nam</p>
            <p><strong>Đặt hàng:</strong> 1800 10106</p>
            <p><strong>Email:</strong> support.dazzycoffee@.com.vn</p>
          </div>

          {/* Cột 4: App & Mạng xã hội */}
          <div className="footer-column">
            <img src="/imge/logocatnen.png " alt="DazzyCoffee Logo" className="footer-logo" />
            <a href="/#" className="footer-app-link">DOWNLOAD APP</a>
            <a href="/#" className="footer-app-link orange">DAZZYCOFFEE APP</a>
            
            <div className="footer-download">
              <img src="/imge/qr-code.png" alt="QR Code" className="footer-qr" />
              <div className="footer-social">
                <h3>FOLLOW US</h3>
                <div className="social-icons">
                  <a href="facebook.com/truongdaihocvanlang" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                  <a href="/#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Phần thanh pháp lý (ở dưới cùng) */}
      <div className="footer-bottom-bar">
        <div className="footer-container">
          <p>Công ty cổ phần thương mại dịch vụ Trà Cà Phê VN</p>
          <p>Mã số DN: 0000000 do sở kế hoạch và đầu tư tp. HCM cấp ngày 25/09/2025. Người đại diện: Rabit</p>
          <p>Địa chỉ:  Điện thoại: (00) 123456789  Email: hi@DAZZYCOFFEE.vn</p>
          <p>© 2023-2025 Công ty cổ phần thương mại dịch vụ Trà Cà Phê VN mọi quyền bảo lưu</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
