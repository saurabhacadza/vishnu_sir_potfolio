'use client'

import HeroSection from './components/sections/HeroSection'
import CoursesSection from './components/sections/CoursesSection'
import FacultySection from './components/sections/FacultySection'
import HistoryVisionSection from './components/sections/HistoryVisionSection'
import TeachingMethodologySection from './components/sections/TeachingMethodologySection'
import Footer from './components/layout/footer/Footer'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CoursesSection />
      <FacultySection />
      <HistoryVisionSection />
      <TeachingMethodologySection />
      <Footer />
    </>
  )
}
