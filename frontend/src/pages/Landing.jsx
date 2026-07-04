import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLongArrowAltRight, FaLeaf, FaRobot, FaWallet, FaSatellite, FaTractor, FaShoppingCart } from 'react-icons/fa';
import Hero3D from '../components/Hero3D';
import AnimatedCounter from '../components/AnimatedCounter';
import './Landing.css';

import devalImg from '../assets/deval_agri2.png';
import abhayImg from '../assets/abhay_agri.jpeg';

const Landing = () => {

  // Reusable animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="landing-page">

      {/* 1. HERO SECTION */}
      <section className="hero-section container">
        <div className="hero-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="small-tag">Agriculture Technology</span>
            <h1 className="hero-title">
              CREATING FUTURE<br />FOR AGRICULTURE
            </h1>
            <p className="hero-subtext">
              We provide AI-powered smart farming solutions, precision agriculture predictions, and an integrated marketplace to maximize your crop yields sustainably.
            </p>

            <div className="hero-buttons">
              <Link to="/services" className="btn btn-primary">
                Explore Our Solutions
              </Link>
              <Link to="/contact" className="btn btn-outline hero-consult-btn">
                Get a Free Consultation <FaLongArrowAltRight />
              </Link>
            </div>

            <div className="social-proof">
              <div className="avatars">
                <div className="avatar a1"></div>
                <div className="avatar a2"></div>
                <div className="avatar a3"></div>
                <div className="avatar a4"></div>
              </div>
              <div className="proof-text">
                <strong><AnimatedCounter from={0} to={10} suffix="k+" /></strong>
                Happy Farmers
              </div>
            </div>
          </motion.div>
        </div>

        <div className="hero-right">
          <Hero3D />
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section id="services" className="services-section container section-padding">
        <motion.div
          className="section-header"
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp}
        >
          <span className="small-tag center">Our Services</span>
          <h2>Smart Agri-Tech For Sustainable Impact</h2>
          <p>We leverage cutting-edge artificial intelligence and modern agronomy to redefine global farming standards.</p>
        </motion.div>

        <motion.div
          className="grid-3 services-grid"
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Service Cards */}
          <motion.div variants={fadeUp} className="service-card">
            <div className="srv-icon" style={{ color: '#2D6A4F', background: 'rgba(45,106,79,0.1)' }}><FaLeaf /></div>
            <h3>Crop Management</h3>
            <p>AI-powered crop selection and prediction models tailored to your soil health and specific local climate.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="service-card">
            <div className="srv-icon" style={{ color: '#0077b6', background: 'rgba(0,119,182,0.1)' }}><FaRobot /></div>
            <h3>ML Integration</h3>
            <p>Advanced machine learning models computing dynamic parameters for substantially better yields.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="service-card">
            <div className="srv-icon" style={{ color: '#F4A261', background: 'rgba(244,162,97,0.1)' }}><FaWallet /></div>
            <h3>Finance Management</h3>
            <p>Direct crop sales with secure payments, empowering you to eliminate middlemen entirely.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="service-card">
            <div className="srv-icon" style={{ color: '#8B5E3C', background: 'rgba(139,94,60,0.1)' }}><FaSatellite /></div>
            <h3>Satellite Data</h3>
            <p>Real-time weather, regional rainfall forecasts, and crucial climate insights pulled globally.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="service-card">
            <div className="srv-icon" style={{ color: '#E07A5F', background: 'rgba(224,122,95,0.1)' }}><FaTractor /></div>
            <h3>Fleet Management</h3>
            <p>Monitor massive farming operations smartly with GPS mapping and localized equipment routing.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="service-card">
            <div className="srv-icon" style={{ color: '#52B788', background: 'rgba(82,183,136,0.1)' }}><FaShoppingCart /></div>
            <h3>Online Marketplace</h3>
            <p>Buy and sell crops directly within our community network ensuring maximum financial returns.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. MISSION & VALUES SECTION */}
      <section className="mission-section section-padding">
        <div className="container grid-2 mission-grid">
          <motion.div
            className="mission-card dark-mission"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            <span className="tag-outline">Our Mission</span>
            <h2>Empowering Lives Through Digital Agriculture</h2>
            <p className="m-desc">Through artificial intelligence, continuous machine learning, and advanced sensor hardware, we deliver solutions that reduce waste, conserve life-giving water, and directly promote global sustainability.</p>

            <div className="m-features">
              <div className="m-feat">
                <h4>Leading AgriFeed Tech Solutions Provider</h4>
              </div>
              <div className="m-feat">
                <h4>Connected Solutions for Sustainability</h4>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mission-card white-mission"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            <span className="tag-solid">Our Vision</span>
            <h2>Our Values: Innovation, Connection, Sustainability</h2>

            <div className="values-grid">
              <div className="v-box">
                <span className="v-icon">🌿</span>
                <p>Provide a Means of Sustainable Income</p>
              </div>
              <div className="v-box">
                <span className="v-icon">🔒</span>
                <p>Building a Future of Safe and Sustainable Food</p>
              </div>
              <div className="v-box">
                <span className="v-icon">⭐</span>
                <p>Promote High Standards of Data Integrity</p>
              </div>
              <div className="v-box">
                <span className="v-icon">🤝</span>
                <p>Partnering with Communities for a Stronger Tomorrow</p>
              </div>
              <div className="v-box full-w">
                <span className="v-icon">📈</span>
                <p>Strategic Investment for Meaningful Growth</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. WHY US - DIAGRAM SECTION */}
      <section id="features" className="diagram-section container section-padding">
        <motion.div className="section-header center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <span className="small-tag">Innovation Engine</span>
          <h2>Driving The Future Of Agriculture<br />Through Innovation And Collaboration</h2>
          <p>We build interconnected chains that unify every sector of the agricultural pipeline into a single responsive network.</p>
        </motion.div>

        {/* Circular SVG Diagram Illusion */}
        <motion.div className="eco-diagram" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          <div className="d-center-node">
            <FaLeaf className="d-icon" />
          </div>
          {/* Surrounding Nodes */}
          <div className="d-node node-1">🌱 Nursery</div>
          <div className="d-node node-2">👨‍🌾 Grower</div>
          <div className="d-node node-3">⚙️ Processing</div>
          <div className="d-node node-4">🚛 Logistics</div>
          <div className="d-node node-5">🏪 Wholesale</div>
          <div className="d-node node-6">🏬 Retailer</div>
        </motion.div>

        {/* 6 Grid layout below diagram */}
        <motion.div className="grid-3 node-details" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div className="node-box" variants={fadeUp}>
            <h4>🌱 Nursery</h4>
            <p>Establishing secure foundations via deep predictive climate analysis from seed day 1.</p>
          </motion.div>
          <motion.div className="node-box" variants={fadeUp}>
            <h4>👨‍🌾 Grower</h4>
            <p>Empowering farmers with AI analytics to detect hazards long before they become crises.</p>
          </motion.div>
          <motion.div className="node-box" variants={fadeUp}>
            <h4>⚙️ Processing</h4>
            <p>Integrating hardware telemetry to automate harvest logistics flawlessly.</p>
          </motion.div>
          <motion.div className="node-box" variants={fadeUp}>
            <h4>🚛 Logistics</h4>
            <p>Tracking temperatures and minimizing crop rot delays via smart routing algorithms.</p>
          </motion.div>
          <motion.div className="node-box" variants={fadeUp}>
            <h4>🏪 Wholesale</h4>
            <p>Directly matching buyers to sellers, terminating opaque pricing manipulations entirely.</p>
          </motion.div>
          <motion.div className="node-box" variants={fadeUp}>
            <h4>🏬 Retailer</h4>
            <p>Building a resilient shelf-supply chain ensuring fresh sustainability ends in consumer hands.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* 5. TEAM SECTION */}
      <section id="about" className="team-section section-padding" style={{ background: 'var(--light-gray)' }}>
        <div className="container">
          <motion.div className="section-header center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="small-tag">Our Leaders</span>
            <h2>The Experts Behind Smart<br />Agricultural Innovation</h2>
          </motion.div>

          <motion.div className="grid-3" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            {[1, 2, 3].map((n) => (
              <motion.div key={n} variants={fadeUp} className="team-card">
                <div
                  className="t-image"
                  style={
                    n === 1 ? { backgroundImage: `url(${devalImg})` } :
                      n === 2 ? { backgroundImage: `url(${abhayImg})` } :
                        {}
                  }
                ></div>
                <div className="t-info">
                  <h4>{['Deval Hole', 'Abhay Gite', 'Rutuj Desale'][n - 1]}</h4>
                  <p>{['MERN Developer', 'Frontend Developer | Founder & CEO UrbanRize', 'AI/ML Developer'][n - 1]}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. CTA SECTION */}
      <section className="cta-section">
        <div className="cta-overlay"></div>
        <motion.div className="container cta-content" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <span className="small-tag" style={{ color: 'var(--white)' }}>Contact Us</span>
          <h2>Elevate Your Agri-Tech Potential —<br />Join Us Today!</h2>
          <p>Don't fall behind. Empower your farm with next-generation machine learning tools that drive unprecedented sustainability and growth.</p>

          <div className="cta-actions">
            <input type="email" placeholder="Enter your email address..." className="cta-input" />
            <button className="btn btn-primary cta-btn">Join Now <FaLongArrowAltRight /></button>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Landing;
