import { drivePreviewUrl, getDriveId } from '@/lib/embed'
import './testimonials.css'

const driveVideoUrl =
  'https://drive.google.com/file/d/1fdhiCeO3szbVitBmxwb-Lf5AHcaCba8f/view?usp=sharing'

const driveId = getDriveId(driveVideoUrl)
const testimonialVideoSrc = driveId ? drivePreviewUrl(driveId) : null

export default function TestimonialsPage() {
  return (
    <main className="page testimonials-page testimonials-video-page">
      <section className="testimonials-video">
        <div className="container testimonials-video__container">
          <div className="testimonials-video__header">
            <p className="testimonials-video__eyebrow">Testimonials</p>
            <h1>Student Voice</h1>
            <p className="testimonials-video__subtitle">
              Real experience shared by our students and parents.
            </p>
          </div>

          <div className="testimonials-video__frame is-rotated">
            <span className="testimonials-video__corner-tag">Student Voice</span>
            {testimonialVideoSrc ? (
              <iframe
                src={testimonialVideoSrc}
                title="Vidya Bhumi testimonial video"
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <p>
                Testimonial video is unavailable right now.{' '}
                <a href={driveVideoUrl} target="_blank" rel="noreferrer">
                  Open in Google Drive
                </a>
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
