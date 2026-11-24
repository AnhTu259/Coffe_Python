import React, { useState } from 'react';
import './SearchBar.css';

/**
 * Thanh tìm kiếm luôn hiển thị, không còn popup.
 * Gọi onSearch ngay khi người dùng nhập.
 */
function SearchBar({ onSearch, placeholder = "Tìm kiếm sản phẩm..." }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch?.('');
  };

  return (
    <div className="search-inline">
      <i className="fas fa-search search-icon" aria-hidden="true"></i>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
      />
      {searchTerm && (
        <button className="search-clear-btn" onClick={handleClear} type="button" aria-label="Xóa tìm kiếm">
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
