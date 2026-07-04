import React from 'react';
import { motion } from 'framer-motion';

const FloatingCard = ({ title, icon, delay = 0, className = "" }) => {
  return (
    <motion.div
      className={`floating-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 3 + Math.random() * 2,
          ease: "easeInOut",
          delay: delay
        }}
        className="floating-card-inner"
      >
        <div className="fc-icon">{icon}</div>
        <div className="fc-title">{title}</div>
      </motion.div>
    </motion.div>
  );
};

export default FloatingCard;
