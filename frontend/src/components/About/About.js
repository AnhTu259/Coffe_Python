import React from 'react';
import './About.css';

function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <p className="about-kicker">Signature Roastery • Since 2004</p>
        <h2 className="section-title">Về chúng tôi</h2>

        <div className="about-content">
          <div className="about-image">
            <div className="about-image-frame">
              <img src="/imge/Logo.jpg" alt="Không gian rang xay" />
              <span className="about-image-glow" aria-hidden="true"></span>
            </div>
            <div className="about-scroll-cue">
              <span>Trải nghiệm 3D</span>
            </div>
          </div>

          <div className="about-text">
            <div className="about-text-box">
              <h3 className="about-heading">Hơn 20 năm tinh chỉnh hương vị đa chiều</h3>
              <p className="about-description">
                Chúng tôi rang xay từng mẻ hạt bằng kỹ thuật profile 3 lớp nhiệt, giúp mở khóa toàn bộ
                tầng hương caramel, cacao và hoa quả chín. Tất cả được hoàn thiện trong phòng lab kính
                để bạn chiêm ngưỡng hành trình của mỗi hạt.
              </p>
              <p className="about-description">
                Đội ngũ roaster và barista của chúng tôi liên tục thử nghiệm với thiết bị cảm biến
                chiều sâu, đảm bảo từng ly cà phê luôn đồng nhất và sống động dù bạn thưởng thức tại
                quán hay take-away.
              </p>

              <div className="about-highlights">
                <div className="about-highlight">
                  <span className="about-highlight-value">5K+</span>
                  <span className="about-highlight-label">ly phục vụ mỗi ngày</span>
                </div>
                <div className="about-highlight">
                  <span className="about-highlight-value">12</span>
                  <span className="about-highlight-label">phòng lab trải nghiệm</span>
                </div>
                <div className="about-highlight">
                  <span className="about-highlight-value">3D</span>
                  <span className="about-highlight-label">tour rang xay trực tiếp</span>
                </div>
              </div>

              <button className="about-button" type="button">Tìm hiểu thêm</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
