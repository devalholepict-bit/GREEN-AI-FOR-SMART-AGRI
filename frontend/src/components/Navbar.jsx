import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaLeaf, FaBars, FaTimes, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract auth states
  const { farmer, customer, admin, farmerLogout, customerLogout, adminLogout } = useContext(AuthContext);

  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/register');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Handlers for logging out
  const handleLogout = () => {
    if (farmer) farmerLogout();
    if (customer) customerLogout();
    if (admin) adminLogout();
    navigate('/');
  };

  // 1. STATE: LOGGED OUT
  if (!farmer && !customer && !admin) {
    return (
      <nav className={`navbar ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="container nav-container">
          <Link to="/" className="nav-logo">
            <FaLeaf className="logo-icon" />
            <span>Green AI</span>
          </Link>

          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {/* Login Dropdown */}
            <div className="nav-dropdown">
              <span className="nav-item drop-trigger">Login <FaChevronDown size={12}/></span>
              <div className="dropdown-menu">
                <Link to="/farmer/login" className="drop-item">🌾 Farmer Login</Link>
                <Link to="/customer/login" className="drop-item">🛒 Customer Login</Link>
                <Link to="/admin/login" className="drop-item">🔐 Admin Login</Link>
              </div>
            </div>
            
            {/* Sign Up Dropdown */}
            <div className="nav-dropdown">
              <span className="nav-item drop-trigger">Sign Up <FaChevronDown size={12}/></span>
              <div className="dropdown-menu">
                <Link to="/farmer/register" className="drop-item">🌾 Farmer Register</Link>
                <Link to="/customer/register" className="drop-item">🛒 Customer Register</Link>
              </div>
            </div>

            <div className="mobile-actions">
              {!isAuthPage && <Link to="/farmer/register" className="btn btn-primary">Get Started</Link>}
            </div>
          </div>

          <div className="nav-actions">
            {!isAuthPage && <Link to="/farmer/register" className="btn btn-primary">Get Started</Link>}
          </div>

          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>
    );
  }

  // 2. STATE: FARMER LOGGED IN
  if (farmer) {
    return (
      <nav className={`navbar ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="container nav-container">
          <Link to="/farmer/dashboard" className="nav-logo">
            <FaLeaf className="logo-icon" />
            <span>Green AI <small style={{fontSize:'0.6rem', color:'#666'}}>FARMER</small></span>
          </Link>

          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/farmer/crop-prediction" className="nav-item">Prediction</Link>
            <Link to="/farmer/crop-recommendation" className="nav-item">Recommendation</Link>
            <Link to="/farmer/trade" className="nav-item">Trade</Link>
            
            {/* Tools Dropdown */}
            <div className="nav-dropdown">
              <span className="nav-item drop-trigger">Tools <FaChevronDown size={12}/></span>
              <div className="dropdown-menu">
                <Link to="/farmer/fertilizer" className="drop-item">Fertilizer Guide</Link>
                <Link to="/farmer/yield-prediction" className="drop-item">Yield Forecast</Link>
                <Link to="/farmer/rainfall-prediction" className="drop-item">Rainfall Tracker</Link>
                <Link to="/farmer/chatbot" className="drop-item">AI Assistant</Link>
              </div>
            </div>

            <div className="mobile-actions">
              <div className="auth-badge"><FaUserCircle/> {farmer.farmer_name}</div>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </div>
          </div>

          <div className="nav-actions">
            <div className="auth-badge"><FaUserCircle/> {farmer.farmer_name.split(' ')[0]}</div>
            <button onClick={handleLogout} className="btn btn-outline" style={{padding:'0.4rem 1rem'}}>Logout</button>
          </div>

          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>
    );
  }

  // 3. STATE: CUSTOMER LOGGED IN
  if (customer) {
    return (
      <nav className={`navbar ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="container nav-container">
          <Link to="/customer/dashboard" className="nav-logo">
            <FaLeaf className="logo-icon" />
            <span>Green AI <small style={{fontSize:'0.6rem', color:'#666'}}>MARKET</small></span>
          </Link>

          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/customer/marketplace" className="nav-item">Marketplace</Link>
            <Link to="/customer/cart" className="nav-item">My Orders</Link>
            
            <div className="mobile-actions">
              <div className="auth-badge"><FaUserCircle/> {customer.cust_name}</div>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </div>
          </div>

          <div className="nav-actions">
            <div className="auth-badge"><FaUserCircle/> {customer.cust_name.split(' ')[0]}</div>
            <button onClick={handleLogout} className="btn btn-outline" style={{padding:'0.4rem 1rem'}}>Logout</button>
          </div>

          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>
    );
  }

  // 4. STATE: ADMIN LOGGED IN
  if (admin) {
    return (
      <nav className={`navbar ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="container nav-container">
          <Link to="/admin/dashboard" className="nav-logo">
            <FaLeaf className="logo-icon" style={{color:'var(--dark)'}}/>
            <span style={{color:'var(--dark)'}}>Green AI <small style={{fontSize:'0.6rem', color:'#d00000'}}>ADMIN</small></span>
          </Link>

          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/admin/farmers" className="nav-item" style={{color:'var(--dark)'}}>Farmers</Link>
            <Link to="/admin/customers" className="nav-item" style={{color:'var(--dark)'}}>Customers</Link>
            <Link to="/admin/crops" className="nav-item" style={{color:'var(--dark)'}}>Crops</Link>
            <Link to="/admin/queries" className="nav-item" style={{color:'var(--dark)'}}>Queries</Link>
            
            <div className="mobile-actions">
              <div className="auth-badge" style={{background:'#222', color:'white'}}><FaUserCircle/> Admin</div>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </div>
          </div>

          <div className="nav-actions">
            <div className="auth-badge" style={{background:'#222', color:'white'}}><FaUserCircle/> Admin</div>
            <button onClick={handleLogout} className="btn btn-outline" style={{padding:'0.4rem 1rem'}}>Logout</button>
          </div>

          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>
    );
  }
};

export default Navbar;
