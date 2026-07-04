import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container footer-grid">

        {/* Column 1 */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            <FaLeaf className="logo-icon" />
            <span>Green AI</span>
          </Link>
          <p className="footer-desc">
            Leading the future of agriculture by integrating artificial intelligence into every step of farming.
          </p>
          <p>📍 Pune Institute of Computer Technology, Pune</p>
          <p>📞 +91 9876543210</p>
          <p>✉️ support@greenaisystems.com</p>
        </div>

        {/* Column 2 - Services */}
        <div className="footer-col">
          <h4>Our Services</h4>
          <ul>
            <li><Link to="#">Crop Prediction</Link></li>
            <li><Link to="#">Crop Recommendation</Link></li>
            <li><Link to="#">Fertilizer Guide</Link></li>
            <li><Link to="#">Yield Prediction</Link></li>
            <li><Link to="#">Rainfall Forecast</Link></li>
            <li><Link to="#">Marketplace</Link></li>
          </ul>
        </div>

        {/* Column 3 - Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="#about">About Us</Link></li>
            <li><Link to="#team">Our Team</Link></li>
            <li><Link to="#contact">Contact</Link></li>
            <li><Link to="#">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Column 4 - Contact */}
        <div className="footer-col">
          <h4>Connect With Us</h4>
          <div className="social-links">
            <a href="#" className="social-icon"><FaTwitter /></a>
            <a href="#" className="social-icon"><FaFacebookF /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaLinkedinIn /></a>
          </div>
          <a href="#" className="btn btn-outline footer-whatsapp">
            <FaWhatsapp /> Pre-sale Chat
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} Green AI Systems. All rights reserved.</p>
          <p>Powered by Green AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
