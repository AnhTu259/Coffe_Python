import React from 'react';
import './Review.css';

const reviews = [
  {
    id: 1,
    text:
      'Cà phê ở đây giàu tầng hương và có chiều sâu rất khác biệt. Trải nghiệm 3D tour rang xay khiến tôi hiểu rõ hơn về gu của mình.',
    name: 'Linh Nguyễn',
    role: 'Coffee Blogger',
    rating: 5,
  },
  {
    id: 2,
    text:
      'Không gian kính, ánh sáng vàng và mùi hương cà phê lan tỏa tạo cảm giác như đang ở trong một phòng lab tương lai.',
    name: 'David Phạm',
    role: 'Creative Director',
    rating: 5,
  },
  {
    id: 3,
    text:
      'Đội ngũ barista giải thích rất kỹ về profile hạt, còn ly cà phê thì cân bằng hoàn hảo giữa caramel và vị chua sáng.',
    name: 'An Trần',
    role: 'Specialty Enthusiast',
    rating: 4,
  },
];

const getInitials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

function Review() {
  return (
    <section className="review" id="review">
      <div className="review-container">
        <p className="section-kicker">Community Feedback</p>
        <h2 className="section-title">Đánh giá từ những người yêu cà phê</h2>

        <div className="review-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.id}>
              <div className="review-glow" aria-hidden="true"></div>
              <div className="review-quote">“</div>
              <p className="review-text">{review.text}</p>

              <div className="review-meta">
                <div className="review-avatar">{getInitials(review.name)}</div>
                <div>
                  <h3 className="review-name">{review.name}</h3>
                  <p className="review-role">{review.role}</p>
                </div>
                <div className="review-rating" aria-label={`${review.rating} trên 5`}>
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <i key={index} className="fas fa-star" aria-hidden="true"></i>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Review;
