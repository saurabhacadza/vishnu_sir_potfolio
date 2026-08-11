'use client';

import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function AboutSection() {
  return (
    <section className="about-section">
      <div className="about-container">
        <motion.div
          className="about-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2>About Vidya Bhumi</h2>
          <div className="header-underline"></div>
        </motion.div>

        <motion.div
          className="about-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Mission */}
          <motion.div className="about-card" variants={itemVariants}>
            <div className="card-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>
              We are a specialized Mathematics and Biology coaching platform focused on building deep conceptual clarity and advanced problem-solving ability for high school and competitive exam students.
            </p>
            <p className="highlight">
              <strong>Strong fundamentals → Structured thinking → Exam-level execution.</strong>
            </p>
          </motion.div>

          {/* Philosophy */}
          <motion.div className="about-card" variants={itemVariants}>
            <div className="card-icon">💡</div>
            <h3>Our Philosophy</h3>
            <p>
              We do not believe in shortcuts, memorization tricks, or rushed syllabus completion. Our goal is to create independent thinkers who can confidently handle unfamiliar and high-difficulty problems.
            </p>
            <p className="philosophy-points">
              ✓ Concept-driven learning<br/>
              ✓ Logic-based approach<br/>
              ✓ Application-oriented teaching
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div className="about-card" variants={itemVariants}>
            <div className="card-icon">🌟</div>
            <h3>Our Vision</h3>
            <p>
              To build a concept-first, system-driven Science & Mathematics learning platform that prepares students not just for exams, but for higher academic thinking.
            </p>
            <p className="highlight">
              <strong>Creating long-term academic strength, not just short-term exam performance.</strong>
            </p>
          </motion.div>

          {/* Problem We Solve */}
          <motion.div className="about-card" variants={itemVariants}>
            <div className="card-icon">🔍</div>
            <h3>The Problem We Address</h3>
            <p>
              Students often cover the syllabus but lack conceptual depth and application skills. We solve this through structured, disciplined academic philosophy backed by years of teaching experience across Indian and international boards.
            </p>
          </motion.div>

          {/* Target Students */}
          <motion.div className="about-card" variants={itemVariants}>
            <div className="card-icon">👨‍🎓</div>
            <h3>For Whom?</h3>
            <p>
              Grades 9–12, JEE Main & Advanced, NEET, AP Calculus (AB & BC), and International Curricula (Australia, US, UK).
            </p>
            <p className="highlight">
              Serious students seeking conceptual depth and competitive excellence.
            </p>
          </motion.div>

          {/* Our Promise */}
          <motion.div className="about-card" variants={itemVariants}>
            <div className="card-icon">✓</div>
            <h3>Our Promise</h3>
            <p>
              High academic expectations, honest guidance, structured feedback, and consistent mentoring to help you achieve your full potential.
            </p>
            <p className="highlight">
              <strong>Your success is our success.</strong>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
