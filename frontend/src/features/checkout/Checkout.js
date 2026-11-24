import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function Checkout({ cart, totalPrice, onOrderComplete }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address: '',
    payment_method: 'cod',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Vui lòng nhập họ tên';
    }
    
    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = 'Email không hợp lệ';
    }
    
    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.customer_phone.replace(/\s/g, ''))) {
      newErrors.customer_phone = 'Số điện thoại không hợp lệ';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call API to create order
      if (onOrderComplete) {
        await onOrderComplete(formData);
      }
      
      // Navigate to success page or show success message
      navigate('/order-success', { 
        state: { 
          orderData: formData,
          cart: cart,
          totalPrice: totalPrice
        }
      });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h2>Giỏ hàng trống</h2>
          <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
              <button 
                onClick={() => navigate('/')} 
                className="back-to-shop-btn"
              >
                ← Quay lại mua sắm
              </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">THANH TOÁN</h1>
        
        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Thông tin giao hàng</h2>
            <form onSubmit={handleSubmit} className="checkout-form" noValidate>
              <div className="form-group">
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="Họ và tên"
                  className={errors.customer_name ? 'error' : ''}
                />
                {errors.customer_name && <span className="error-message">{errors.customer_name}</span>}
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={errors.customer_email ? 'error' : ''}
                />
                {errors.customer_email && <span className="error-message">{errors.customer_email}</span>}
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                  className={errors.customer_phone ? 'error' : ''}
                />
                {errors.customer_phone && <span className="error-message">{errors.customer_phone}</span>}
              </div>

              <div className="form-group">
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Địa chỉ giao hàng"
                  className={errors.address ? 'error' : ''}
                  
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Ghi chú thêm (tùy chọn)"
                />
              </div>

              <div className="form-group">
                <label>Phương thức thanh toán *</label>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={formData.payment_method === 'cod'}
                      onChange={handleChange}
                    />
                    <span>💵 Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment_method"
                      value="bank"
                      checked={formData.payment_method === 'bank'}
                      onChange={handleChange}
                    />
                    <span>🏦 Chuyển khoản ngân hàng</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={formData.payment_method === 'card'}
                      onChange={handleChange}
                    />
                    <span>💳 Thẻ tín dụng/Ghi nợ</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="submit-order-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <h2>Đơn hàng của bạn</h2>
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <div className="order-item-info">
                    <h4>{item.name}</h4>
                    <p>Số lượng: {item.quantity}</p>
                  </div>
                  <div className="order-item-price">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <div className="total-row">
                <span>Tạm tính:</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(totalPrice)}
                </span>
              </div>
              <div className="total-row">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className="total-row final">
                <span>Tổng cộng:</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
