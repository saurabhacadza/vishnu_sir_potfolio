'use client'

import { useMemo, useState } from 'react'
import { drivePreviewUrl, getDriveId } from '@/lib/embed'
import './galery.css'

type GalleryCategory = 'classroom' | 'celebration' | 'instruction' | 'testimonial'

type GalleryItem = {
  id: string
  title: string
  caption: string
  image?: string
  youtubeId?: string
  driveVideoUrl?: string
  rotateVideo90?: boolean
}

const CATEGORY_ORDER: GalleryCategory[] = ['classroom', 'celebration', 'instruction', 'testimonial']

const GALLERY_DATA: Record<GalleryCategory, GalleryItem[]> = {
  classroom: [
    {
      id: 'cls-1',
      title: 'Focused Learning',
      caption: 'Students solving problems together in class.',
      image: '/images/image_4.png',
    },
    {
      id: 'cls-2',
      title: 'Board Session',
      caption: 'Step-by-step explanation on core concepts.',
      image: '/images/welcome.jpg',
    },
    {
      id: 'cls-3',
      title: 'Doubt Corner',
      caption: 'Mentors helping learners one-on-one.',
      image: '/images/image_3.png',
    },
    {
      id: 'cls-4',
      title: 'Practice Hour',
      caption: 'Routine revision and timed problem-solving.',
      image: '/images/image_.png',
    },
  ],
  celebration: [
    {
      id: 'cel-1',
      title: 'Achievement Day',
      caption: 'Celebrating milestones with students and mentors.',
      image: '/images/image_3.png',
    },
    {
      id: 'cel-2',
      title: 'Festive Moments',
      caption: 'A joyful environment beyond academics.',
      image: '/images/image_4.png',
    },
    {
      id: 'cel-3',
      title: 'Recognition Event',
      caption: 'Honoring consistency and performance.',
      image: '/images/welcome.jpg',
    },
    {
      id: 'cel-4',
      title: 'Team Spirit',
      caption: 'Shared moments that build confidence.',
      image: '/images/image_.png',
    },
  ],
  instruction: [
    {
      id: 'ins-1',
      title: 'Concept Breakdown',
      caption: 'Structured teaching with practical examples.',
      youtubeId: 'Kj4IpahL_eg',
    },
    {
      id: 'ins-2',
      title: 'Live Explanation',
      caption: 'High-energy sessions with real-time interaction.',
      youtubeId: 'ZCbG0UdgtEM',
    },
    {
      id: 'ins-3',
      title: 'Worksheet Review',
      caption: 'Performance feedback for every learner.',
      image: '/images/image_.png',
    },
    {
      id: 'ins-4',
      title: 'Revision Sprint',
      caption: 'Fast recap rounds before tests.',
      image: '/images/image_3.png',
    },
  ],
  testimonial: [
    {
      id: 'tes-1',
      title: 'Student Feedback',
      caption: 'Stories of confidence and progress.',
      image: '/images/image_4.png',
    },
    {
      id: 'tes-2',
      title: 'Parent Voice',
      caption: 'Trust built through visible outcomes.',
      image: '/images/welcome.jpg',
    },
    {
      id: 'tes-3',
      title: 'Mentor Note',
      caption: 'Consistency and discipline in every batch.',
      image: '/images/image_4.png',
    },
    {
      id: 'tes-4',
      title: 'Result Story',
      caption: 'Positive journeys from classroom to rank list.',
      image: '/images/image_3.png',
    },
  ],
}

function wrapIndex(index: number, length: number) {
  return (index + length) % length
}

function getEmbedSrc(item: GalleryItem): string | null {
  if (item.youtubeId) {
    return `https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0`
  }

  if (item.driveVideoUrl) {
    const driveId = getDriveId(item.driveVideoUrl)
    if (driveId) return drivePreviewUrl(driveId)
  }

  return null
}

function CardMedia({ item }: { item: GalleryItem }) {
  if (item.image) {
    return <img src={item.image} alt={item.title} />
  }

  return (
    <div className="galery-video-placeholder" aria-label={`${item.title} video`}>
      <span>Video Lesson</span>
    </div>
  )
}

export default function GaleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('classroom')
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const currentItems = GALLERY_DATA[activeCategory]

  const visibleCards = useMemo(() => {
    const total = currentItems.length
    return {
      left: currentItems[wrapIndex(activeIndex - 1, total)],
      center: currentItems[wrapIndex(activeIndex, total)],
      right: currentItems[wrapIndex(activeIndex + 1, total)],
    }
  }, [activeIndex, currentItems])
  const centerEmbedSrc = getEmbedSrc(visibleCards.center)

  const changeCategory = (category: GalleryCategory) => {
    setActiveCategory(category)
    setActiveIndex(0)
    setIsVideoPlaying(false)
  }

  const showPrev = () => {
    setActiveIndex((prev) => wrapIndex(prev - 1, currentItems.length))
    setIsVideoPlaying(false)
  }

  const showNext = () => {
    setActiveIndex((prev) => wrapIndex(prev + 1, currentItems.length))
    setIsVideoPlaying(false)
  }

  return (
    <section className="galery-page">
      <div className="galery-backdrop" aria-hidden="true" />
      <div className="container galery-container">
        <div className="galery-shell">
          <p className="galery-eyebrow">galery</p>
          <h1 className="galery-title">My Visual Diary</h1>
          <p className="galery-subtitle">Moments from Vidya Bhumi classrooms and student journeys.</p>

          <div className="galery-options" role="tablist" aria-label="Gallery categories">
            {CATEGORY_ORDER.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                className={`galery-chip${activeCategory === category ? ' is-active' : ''}`}
                onClick={() => changeCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="galery-stage">
            <article className="galery-card galery-card--side galery-card--left">
              <CardMedia item={visibleCards.left} />
            </article>

            <article className="galery-card galery-card--main">
              {centerEmbedSrc && isVideoPlaying ? (
                <div className={`galery-video-wrap${visibleCards.center.rotateVideo90 ? ' is-rotated' : ''}`}>
                  <iframe
                    src={centerEmbedSrc}
                    title={visibleCards.center.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <>
                  <CardMedia item={visibleCards.center} />
                  {centerEmbedSrc && (
                    <button
                      type="button"
                      className="galery-video-play"
                      aria-label="Play video"
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      ▶
                    </button>
                  )}
                </>
              )}
              <div className="galery-card__overlay">
                <h2>{visibleCards.center.title}</h2>
                <p>{visibleCards.center.caption}</p>
              </div>
            </article>

            <article className="galery-card galery-card--side galery-card--right">
              <CardMedia item={visibleCards.right} />
            </article>
          </div>

          <div className="galery-controls">
            <button type="button" onClick={showPrev} aria-label="Previous image">
              ←
            </button>
            <button type="button" onClick={showNext} aria-label="Next image">
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
