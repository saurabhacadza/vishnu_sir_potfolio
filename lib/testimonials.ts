// lib/testimonials.ts
export type Exam = 'JEE' | 'NEET' | 'Foundation' | 'Olympiads';
export type Subject = 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology' | 'General';
export type MediaKind = 'video' | 'image' | 'text';

export type JeeTier = 'mains' | 'advanced';

export type Testimonial = {
  id: string;
  name: string;
  short: string;                 // "AIR 16" | "JEE Main 99.87%ile"
  exam: Exam;
  jeeTier?: JeeTier;             // lets us split JEE Main vs Advanced
  subject: Subject;
  year: number;
  kind: MediaKind;
  program?: string;
  stars?: number;
  badge?: { label?: string; value: string };

  // image (either uploaded to IndexedDB, or dataURL for small images)
  image?: {
    src?: string;                 // for remote (future)
    alt?: string;
    dataUrl?: string;             // local preview (small~medium)
    blobId?: string;              // id if stored as blob in IndexedDB
  };

  // video (either URL or uploaded blob)
  video?: {
    type: 'embed' | 'file';
    src: string;                  // URL or blobId (when type='file')
    poster?: string;              // external poster
    posterDataUrl?: string;       // locally stored thumbnail
    mime?: string;                // when file
  };

  text?: string;
  action?: { label: string; href: string }; // optional button on card
};

export const exams: Exam[] = ['JEE', 'NEET', 'Foundation', 'Olympiads'];
export const subjects: Subject[] = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'General'];
export const mediaKinds: MediaKind[] = ['video', 'image', 'text'];
export const yearsFrom = (rows: Testimonial[]) =>
  Array.from(new Set(rows.map(r => r.year))).sort((a, b) => b - a);

/** Replace this with your DB/API later */
export async function getTestimonials(): Promise<Testimonial[]> {
  // mock data (fits your existing design)
  return [
    {
      id: 't1',
      name: 'Venkatesh Gupta',
      short: 'ISI AIR 17',
      exam: 'Olympiads',
      subject: 'Mathematics',
      year: 2024,
      kind: 'text',
      jeeTier: 'advanced',
      text: 'The structured guidance and exam-like practice helped improve speed and accuracy dramatically.',
      stars: 5,
    },
    {
      id: 't2',
      name: 'Anshul',
      short: 'JEE Topper',
      exam: 'JEE',
      jeeTier: 'mains',
      subject: 'Physics',
      year: 2024,
      kind: 'text',
      text: 'Concept clarity with practice analytics made revisions targeted and effective.',
      stars: 5,
    },
    {
      id: 't3',
      name: 'Ishita Sharma',
      short: 'NEET 690/720',
      exam: 'NEET',
      subject: 'Biology',
      year: 2023,
      kind: 'video',
      video: { type: 'embed', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', poster: '' },
      stars: 5,
    },
    {
      id: 't4',
      name: 'Raghav Jain',
      short: 'JEE Main 99.87%ile',
      exam: 'JEE',
      jeeTier: 'mains',
      subject: 'Mathematics',
      year: 2023,
      kind: 'image',
      image: { src: '/images/results/raghav-99-87.jpg', alt: 'Raghav JEE Main 99.87 percentile' },
      stars: 5,
    },
  ];
}
