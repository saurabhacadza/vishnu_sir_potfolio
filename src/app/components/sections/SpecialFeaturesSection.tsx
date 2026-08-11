'use client';

import React from 'react';
import { motion } from 'framer-motion';

const specialFeatures = [
  {
    icon: '📚',
    title: 'Concept-First Philosophy',
    description: 'We believe in building deep conceptual clarity first. No shortcuts, no memorization tricks — just solid understanding.',
  },
  {
    icon: '👥',
    title: 'Small Batches & Personal Attention',
    description: 'Batches of 20 or one-to-one sessions. Every student gets individual attention and personalized guidance.',
  },
  {
    icon: '🎯',
    title: 'Exam-Ready Problem Solving',
    description: 'Structured thinking and application skills that prepare you for high-difficulty, unfamiliar exam questions.',
  },
  {
    icon: '📖',
    title: 'Quality Study Material',
    description: 'Tailored notes, worksheets, and high-yield problems designed for boards + competitive exams.',
  },
  {
    icon: '🎓',
    title: 'Expert Faculty',
    description: 'Specializing in Mathematics (JEE, Boards, AP Calculus) and Biology (NEET, Boards, International Curricula).',
  },
  {
    icon: '📊',
    title: 'Performance Tracking',
    description: 'Regular diagnostic assessments, mock tests, and personalized feedback to track progress and identify gaps.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
  hover: {
    y: -8,
    transition: { duration: 0.3 },
  },
};

export default function SpecialFeaturesSection() {
  return (
    <section className="special-features-section">
      <div className="special-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2>Curious to know what makes us unique?</h2>
          <p>Here's what sets Vidya Bhumi apart from conventional coaching centers.</p>
        </motion.div>

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {specialFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="card-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="card-accent"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
