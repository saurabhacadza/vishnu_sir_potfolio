import { motion } from 'framer-motion'

const framework = [
  'Conceptual clarity from basics',
  'Logical step-by-step explanations',
  'Progressive difficulty',
  'Error analysis & misconceptions',
  'Reinforcement through application',
]

const mathFocus = [
  'Logic, derivations, and proof-style thinking',
  'Multi-concept problems that demand structured setup',
  'Pacing drills that balance accuracy with speed',
]

const bioFocus = [
  'Concept mapping with NCERT alignment',
  'Diagrams and process flows to anchor memory',
  'Assertion–reason and case-based practice for exams',
]

const teachingHighlights = [
  'Adaptive practice labs',
  'Live doubt clinics',
  'CBT analytics',
  'Revision sprints',
];

const teachingImage = '/images/image_3.png';

const sectionHeaderVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65 } },
};

const badgesContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const badgeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + index * 0.04, duration: 0.45 },
  }),
};

const cardListVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.16, delayChildren: 0.25 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const visualVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function TeachingMethodologySection() {
  return (
    <section id="methodology" className="teaching section section-theme">
      <div className="container teaching-shell">
        <motion.div
          className="teaching-header section-header"
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-120px' }}
        >
          <h2 className="teaching-title">Teaching Methodology</h2>
          <p className="teaching-subtitle">A common framework, tuned by subject depth.</p>
          <div className="section-divider" aria-hidden="true" />
          <motion.div
            className="teaching-badges"
            variants={badgesContainerVariants}
          >
            {teachingHighlights.map((h, index) => (
              <motion.span
                key={h}
                className="teaching-badge"
                variants={badgeVariants}
                custom={index}
              >
                {h}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <div className="teaching-layout">
          <motion.div
            className="teaching-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-140px' }}
            variants={cardListVariants}
          >
            <motion.div className="teaching-card teaching-grid" variants={cardVariants}>
              <div className="teaching-block">
                <div className="teaching-block-title">Common Framework</div>
                <ul className="teaching-list">
                  {framework.map((item) => (
                    <li key={item}>
                      <span className="teaching-dot" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div className="teaching-card teaching-grid" variants={cardVariants}>
              <div className="teaching-block teaching-block--split">
                <div className="teaching-block-title">Subject-wise Focus</div>
                <div className="teaching-subgrid">
                  <div className="teaching-subcol">
                    <div className="teaching-subtitle-small">Mathematics</div>
                    <ul className="teaching-list teaching-list--tight">
                      {mathFocus.map((item) => (
                        <li key={item}>
                          <span className="teaching-line" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="teaching-subcol">
                    <div className="teaching-subtitle-small">Biology</div>
                    <ul className="teaching-list teaching-list--tight">
                      {bioFocus.map((item) => (
                        <li key={item}>
                          <span className="teaching-line" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="teaching-visual"
            variants={visualVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-140px' }}
          >
            <div className="teaching-visual__frame">
              <img
                src={teachingImage}
                alt="Students collaborating during a Re-Wise session"
                className="teaching-visual__img"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
