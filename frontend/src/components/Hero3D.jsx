import React from 'react';
import { motion } from 'framer-motion';
import FloatingCard from './FloatingCard';
import { FaLeaf, FaCloudRain, FaHandshake, FaRobot } from 'react-icons/fa';
import './Hero3D.css';

const Hero3D = () => {
  return (
    <div className="hero-3d-container">
      {/* Background glowing orb */}
      <div className="glow-orb"></div>
      
      {/* Background subtle particles */}
      <div className="particles-container">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            animate={{
              y: [0, Math.random() * -100 - 50],
              opacity: [0, 0.5, 0],
              x: Math.random() * 100 - 50
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Center piece / 3D Illustration Illusion */}
      <motion.div 
        className="center-illustration"
        animate={{ rotateY: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <div className="tech-ring outer-ring"></div>
        <div className="tech-ring inner-ring"></div>
        <div className="center-orb">
           <FaLeaf className="center-leaf" />
        </div>
      </motion.div>

      {/* Floating Cards */}
      <FloatingCard 
        title="Crop Prediction - 94% Accuracy" 
        icon={<FaLeaf color="var(--primary-green)" />}
        delay={0.2}
        className="card-pos-1"
      />
      <FloatingCard 
        title="Rainfall Forecast - Smart AI" 
        icon={<FaCloudRain color="#0077b6" />}
        delay={0.4}
        className="card-pos-2"
      />
      <FloatingCard 
        title="Direct Trade - No Middleman" 
        icon={<FaHandshake color="var(--earth-brown)" />}
        delay={0.6}
        className="card-pos-3"
      />
      <FloatingCard 
        title="AI Assistant - 24/7 Support" 
        icon={<FaRobot color="var(--dark)" />}
        delay={0.8}
        className="card-pos-4"
      />
    </div>
  );
};

export default Hero3D;
