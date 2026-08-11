'use client';

import React from 'react';
import { motion } from 'framer-motion';

const faculty = [
  {
    name: 'Vaishnavi Shettigar',
    subject: 'Biology Faculty',
    specialization: 'Grades 9–12, NEET, International Biology',
    experience: '8+ years',
    description: 'Experienced Biology educator emphasizing NCERT mastery, clear conceptual explanations, and diagram-based learning. Expert in high-yield exam questions.',
    style: 'Conceptual • Detailed • Application-Driven',
    icon: '🔬',
    image: "/images/founders/vaishnavi_ma'am.png",
  },
  {
    name: 'Sapna Jha',
    subject: 'Chemistry Faculty',
    specialization: 'Class 11 & Class 12, Boards and Competitive Examinations',
    experience: '18+ years',
    description:
      'Sapna Jha is an experienced Chemistry educator with 18+ years of teaching experience for Class 11 and Class 12 students. She has mentored 1000+ students across different boards and competitive examinations, helping them build strong conceptual understanding and problem-solving skills in Chemistry.',
    style: 'Conceptual • Problem-Solving • Exam-Oriented',
    icon: '⚗️',
    image: '/images/founders/Sapna Jha.png',
  },
  {
    name: 'Vishnu Walke',
    subject: 'Mathematics Faculty',
    specialization: 'Grades 11–12, JEE Main & Advanced, AP Calculus, SAT',
    experience: '10+ years',
    description: 'Senior Mathematics educator specializing in logic-driven, exam-oriented teaching. Known for building strong mathematical thinking and confidence in every student.',
    style: 'Disciplined • Logic-Driven • Exam-Focused',
    icon: '📐',
    image: '/images/founders/vishnu_sir.png',
  },
  {
    name: 'Rajeev Tiwari',
    subject: 'Finance & Accounts Faculty',
    specialization: 'PG - Finance',
    experience: '15+ years',
    description:
      '15+ industry experience in banking and finance. Co-founder of M/S Hexaconn Finance Pvt Ltd, Noida. Faculty for Finance and Accounts.',
    style: 'Industry-Led • Practical • Finance-Focused',
    icon: '💼',
    image: '/images/founders/Rajeev Tiwari.png',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
  hover: {
    y: -12,
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
    transition: { duration: 0.3 },
  },
};

export default function FacultySection() {
  return (
    <section id="faculty" className="faculty-section">
      <div className="faculty-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2>Meet Our Expert Faculty</h2>
          <p>Subject specialists with proven teaching excellence and competitive exam expertise</p>
        </motion.div>

        <motion.div
          className="faculty-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {faculty.map((teacher, index) => (
            <motion.div
              key={index}
              className="faculty-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="faculty-photo">
                <img src={teacher.image} alt={teacher.name} loading="lazy" />
              </div>
              <h3 className="faculty-name">{teacher.name}</h3>
              <p className="faculty-subject">{teacher.subject}</p>
              
              <div className="faculty-details">
                <div className="detail-row">
                  <span className="label">Experience:</span>
                  <span className="value">{teacher.experience}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Specializes In:</span>
                  <span className="value">{teacher.specialization}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Teaching Style:</span>
                  <span className="value">{teacher.style}</span>
                </div>
              </div>

              <p className="faculty-bio">{teacher.description}</p>
              
              <div className="faculty-accent"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
