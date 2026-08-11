'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const assessmentFormUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSdiNK8yfJiIa5btk4QPr2D1mo40nb8V_xN_IF4695QJVY8J3A/viewform?usp=publish-editor';

type Course = {
  level: string
  desc: string
  image?: string
}

const coursesData: Record<'Mathematics' | 'Biology', Course[]> = {
  Mathematics: [
    { level: 'Grade 9 & 10', desc: 'Foundation building in algebra, geometry, and trigonometry', image: '/images/course/9_10_maths.jpeg' },
    { level: 'Grade 11 & 12', desc: 'Advanced topics: Calculus, Vectors, Probability', image: '/images/course/11_12_maths.jpeg' },
    { level: 'JEE Main', desc: 'Comprehensive prep for JEE Main with high-yield problems', image: '/images/course/jee_mains_maths.jpeg' },
    { level: 'JEE Advanced', desc: 'Intensive training for JEE Advanced qualifiers', image: '/images/course/jee_advanced_maths.jpeg' },
    { level: 'AP Calculus', desc: 'AP Calculus AB & BC aligned with US curriculum', image: '/images/course/AP_calculus.jpeg' },
    { level: 'SAT & International', desc: 'SAT Math + International curricula support', image: '/images/course/SAT.jpeg' },
  ],
  Biology: [
    { level: 'Grade 9 & 10', desc: 'Cell biology, genetics, ecology foundations', image: '/images/course/9-10_biology.jpeg' },
    { level: 'Grade 11 & 12', desc: 'Advanced anatomy, physiology, genetics', image: '/images/course/11-12_bilogy.jpeg' },
    { level: 'NEET (UG)', desc: 'Complete NEET Biology + organic chemistry prep', image: '/images/course/NEET_ug.jpeg' },
    { level: 'International', desc: 'International curricula support (Australia, UK, US)', image: 'images/course/Internationa_bilog.jpeg' },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const tabVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 10, transition: { duration: 0.2 } },
};

const courseVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function CoursesSection() {
  const [activeTab, setActiveTab] = useState<'Mathematics' | 'Biology'>('Mathematics');

  return (
    <section id="courses" className="courses-section">
      <div className="courses-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2>Our Courses</h2>
          <p>Tailored pathways for every student and curriculum</p>
        </motion.div>

        <motion.div
          className="course-tabs"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          {(Object.keys(coursesData) as Array<keyof typeof coursesData>).map((subject) => (
            <button
              key={subject}
              onClick={() => setActiveTab(subject)}
              className={`tab-button ${activeTab === subject ? 'active' : ''}`}
            >
              <span className="tab-icon">{subject === 'Mathematics' ? '📐' : '🔬'}</span>
              {subject}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="courses-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
          >
            {coursesData[activeTab].map((course, index) => (
              <motion.div
                key={course.level}
                className={`course-card${course.image ? ' course-card--image' : ''}`}
                variants={courseVariants}
                whileHover={{ y: -8 }}
                style={
                  course.image
                    ? {
                        backgroundImage: `linear-gradient(180deg, rgba(248, 249, 252, 0.55), rgba(15, 31, 59, 0.15)), url(${course.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }
                    : undefined
                }
              >
                <div className="course-number">{index + 1}</div>
                <h3 className="course-level">{course.level}</h3>
                <p className="course-desc">{course.desc}</p>
                <div className="course-accent"></div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="courses-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <p>Not sure which course is right for you?</p>
          <a
            className="btn-primary"
            href={assessmentFormUrl}
            target="_blank"
            rel="noreferrer"
          >
            Schedule Your Assessment
          </a>
        </motion.div>
      </div>
    </section>
  );
}
