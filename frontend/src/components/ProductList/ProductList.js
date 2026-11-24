import React, { useMemo, useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

/**
 * Component ProductList hiển thị một danh sách các thẻ sản phẩm.
 * Nó nhận một mảng các sản phẩm và một hàm để thêm sản phẩm vào giỏ hàng.
 */
function ProductList({ products, onAddToCart }) {
  const CHUNK_SIZE = 4;
  const slides = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < products.length; i += CHUNK_SIZE) {
      chunks.push(products.slice(i, i + CHUNK_SIZE));
    }
    return chunks.length ? chunks : [[]];
  }, [products]);

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setActiveSlide(0);
  }, [products.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const showNav = slides.length > 1;

  return (
    <div className="product-list">
      {showNav && (
        <div className="product-slider-nav">
          <button type="button" onClick={prevSlide} aria-label="Trước">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button type="button" onClick={nextSlide} aria-label="Sau">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      <div className="products-grid">
        {slides[activeSlide].map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
