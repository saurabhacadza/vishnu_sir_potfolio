import { motion } from 'framer-motion'

const points = [
  {
    title: 'Problem in education',
    text: 'Too many classrooms rush the syllabus without depth, leaving students to guess under exam pressure.',
  },
  {
    title: 'Built through outcomes',
    text: 'Results and referrals grew the cohort; each rank earned by systematic practice and mentorship.',
  },
  {
    title: 'Across boards',
    text: 'Experience spans Indian boards and international curricula — Boards, JEE, NEET, AP, IB.',
  },
]

export default function HistoryVisionSection() {
  return (
    <section id="history" className="history section section-theme">
      <div className="container history-grid">
        <motion.div
          className="history-copy section-header"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true, margin: '-120px' }}
        >
          <div className="section-divider" aria-hidden="true" />
          <div className="history-eyebrow">
            History &amp; Vision
          </div>
          <h2 className="history-title">
            Authority built on depth.
          </h2>
          <p className="history-vision">
            To build a concept-first, system-driven Science &amp; Mathematics learning platform.
          </p>
        </motion.div>

        <motion.div
          className="history-timeline"
          aria-label="History and vision timeline"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-140px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.2,
              },
            },
          }}
        >
          <div className="history-line" />
          {points.map((item) => (
            <motion.div
              key={item.title}
              className="history-point"
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
              }}
            >
              <div className="history-dot" />
              <div className="history-content">
                <div className="history-point-title">{item.title}</div>
                <p>{item.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
