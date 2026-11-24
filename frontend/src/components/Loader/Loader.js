import React from 'react';
import './Loader.css';
import logo from './imge/loader.png';

function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader-logo">
          <img src={logo} alt="DazzyCoffee Loading..." className="loader-image" />
        </div>
      </div>
      <div className="loader-text">DazzyCoffee</div>
    </div>
  );
}

export default Loader;