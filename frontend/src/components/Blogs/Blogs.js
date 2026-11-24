import React from 'react';
import './Blogs.css';

/**
 * Component Blogs hiển thị danh sách các bài viết blog.
 * Mỗi bài viết được trình bày dưới dạng một thẻ với hình ảnh, tiêu đề, ngày đăng và mô tả ngắn gọn.
 */
function Blogs() {
  // Dữ liệu mẫu cho các bài viết blog
  const blogPosts = [
    {
      id: 1,
      image: '/imge/Logo.jpg',
      title: 'Cách pha cà phê ngon tại nhà',
      date: '21 tháng 5, 2024',
      description: 'Khám phá những bí quyết để pha một tách cà phê hoàn hảo ngay tại căn bếp của bạn. Từ việc chọn hạt đến kỹ thuật pha chế, chúng tôi sẽ hướng dẫn bạn từng bước.'
    },
    {
      id: 2,
      image: '/imge/Logo.jpg',
      title: 'Lịch sử thú vị của cà phê',
      date: '15 tháng 4, 2024',
      description: 'Hành trình của cà phê từ những ngọn núi Ethiopia đến ly của bạn ngày nay. Một câu chuyện đầy mê hoặc về thức uống được yêu thích nhất thế giới.'
    },
    {
      id: 3,
      image: '/imge/Logo.jpg',
      title: 'Lợi ích sức khỏe của cà phê',
      date: '01 tháng 3, 2024',
      description: 'Ngoài hương vị tuyệt vời, cà phê còn mang lại nhiều lợi ích cho sức khỏe. Tìm hiểu cách cà phê có thể cải thiện tâm trạng và tăng cường năng lượng của bạn.'
    },
  ];

  return (
    <section className="blogs-section" id="blogs"> {/* Phần Blogs chính */}
      <div className="blogs-container">
        <h2 className="section-title">Bài viết mới nhất</h2> {/* Tiêu đề phần */}
        <div className="blogs-grid"> {/* Container chứa các bài viết blog */}
          {blogPosts.map(post => (
            <div className="blog-card" key={post.id}> {/* Thẻ bài viết blog */}
              <div className="blog-image-container"> {/* Container hình ảnh blog */}
                <img src={post.image} alt={post.title} className="blog-image" /> {/* Hình ảnh bài viết */}
              </div>
              <div className="blog-content"> {/* Nội dung bài viết */}
                <h3 className="blog-title">{post.title}</h3> {/* Tiêu đề bài viết */}
                <p className="blog-meta">{post.date}</p> {/* Ngày đăng */}
                <p className="blog-description">{post.description}</p> {/* Mô tả ngắn */}
                <button className="blog-read-more-btn">Đọc thêm</button> {/* Nút đọc thêm */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Blogs;
