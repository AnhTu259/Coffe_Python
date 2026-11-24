import React from 'react';
import './Contact.css';

/**
 * Component Contact hiển thị thông tin liên hệ và một biểu mẫu liên hệ.
 * Nó cho phép người dùng gửi tin nhắn hoặc tìm địa điểm trên bản đồ.
 */
function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <h2 className="section-title">Liên hệ chúng tôi</h2>
        <div className="contact-content">
          <div className="contact-map">
            <iframe
              title="Van Lang University Location"
              src="https://maps.google.com/maps?q=Tr%C6%B0%E1%BB%9Dng%20%C4%90%E1%BA%A1i%20h%E1%BB%8Dc%20V%C4%83n%20Lang%20-%20C%C6%A1%20s%E1%BB%9F%203&t=&z=17&ie=UTF8&iwloc=&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="contact-details">
              <h3>Đại học Văn Lang - Cơ sở 3</h3>
              <p>80/68 Dương Quảng Hàm, Phường 5, Gò Vấp, TP. Hồ Chí Minh</p>
              <p><strong>Hotline:</strong> 000 000 000</p>
              <p><strong>Email:</strong> DazzyCoffee@gmail.com</p>
            </div>
          </div>
          <div className="contact-form-container">
            <h3 className="contact-form-title">Gửi tin nhắn cho chúng tôi</h3>
            <form className="contact-form">
              <div className="form-group">
                <i className="fas fa-user input-icon"></i>
                <input type="text" placeholder="Tên của bạn" required />
              </div>
              <div className="form-group">
                <i className="fas fa-envelope input-icon"></i>
                <input type="email" placeholder="Email của bạn" required />
              </div>
              <div className="form-group">
                <i className="fas fa-phone input-icon"></i>
                <input type="tel" placeholder="Số điện thoại của bạn" required />
              </div>
              <div className="form-group">
                <i className="fas fa-comment-dots input-icon"></i>
                <textarea placeholder="Tin nhắn của bạn" required></textarea>
              </div>
              <button type="submit" className="contact-submit-btn">Gửi ngay</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
