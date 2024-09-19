// src/components/Footer/Footer.js
import React from 'react';
import './Footer.css';
import white_logo from '../../images/white-quantum-long-logo.png'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="logo-container">
        <img src={white_logo} alt="Company Logo" className="company-logo" />
      </div>
      <p>&copy; 2024 Quantum Outsourcing Group. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
