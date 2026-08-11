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
  jeeTier?: JeeTier;             // differentiate JEE Main vs Advanced highlights
  subject: Subject;
  year: number;
  kind: MediaKind;
  program?: string;
  stars?: number;
  badge?: { label?: string; value: string };
  rank?: number | string;

  // image (either uploaded to IndexedDB, or dataURL for small images)
  image?: {
    id?: string;
    url?: string;                 // for remote (future)
    alt?: string;
    provider?: string;
    dataUrl?: string;             // local preview (small~medium)
    blobId?: string;              // id if stored as blob in IndexedDB
  };

  // video (either URL or uploaded blob)
  video?: {
    type: 'embed' | 'file';
    provider?: string;
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
  return [
    {
      id: 'aman-sharma',
      name: 'Aman Sharma',
      short: 'AIR 751',
      exam: 'JEE',
      jeeTier: 'advanced',
      subject: 'Mathematics',
      year: 2024,
      kind: 'text',
      text: 'Every doubt session at Re-Wise ended with a clear plan for the next attempt. The mentors pushed me to think deeper and finish each paper with confidence.',
      stars: 5,
      image: {
        url: 'https://drive.google.com/file/d/14Kmu7yT7SrCsh-_T4gjVSBqep_InwOw3/view?usp=sharing',
        alt: 'Aman Sharma AIR 751',
      },
    },
    {
      id: 'bhavush',
      name: 'Bhavishya',
      short: 'AIR 73',
      exam: 'JEE',
      jeeTier: 'advanced',
      subject: 'Physics',
      year: 2025,
      kind: 'text',
      text: 'The structured revision calendar and AI practice tracker meant I never had to guess what to solve next. It felt like the entire faculty solved the paper with me.',
      stars: 5,
      image: {
        url: 'https://drive.google.com/file/d/1UBfSoatcfYRoMQaXgo51eNrLaVukR-A5/view?usp=sharing',
        alt: 'Bhavush AIR 73',
      },
    },
    {
      id: 'bipul-kumar',
      name: 'Bipul Kumar',
      short: 'AIR 110',
      exam: 'JEE',
      jeeTier: 'advanced',
      subject: 'Chemistry',
      year: 2025,
      kind: 'text',
      text: 'Weekly mock vivas, CBTs and personal calls kept my preparation honest. The mentors balanced pressure with patience which helped me break into the Top 100.',
      stars: 5,
      image: {
        url: 'https://drive.google.com/file/d/1SJDHT9Xv-EvV3ONhIT_N0KgG7QiZ3hKb/view?usp=sharing',
        alt: 'Bipul Kumar AIR 100',
      },
    },
    {
      id: 'shreshtha-agrawal',
      name: 'Shreshtha Agrawal',
      short: 'AIR 140',
      exam: 'JEE',
      jeeTier: 'advanced',
      subject: 'General',
      year: 2025,
      kind: 'text',
      text: 'Re-Wise taught me to treat every mock as the final exam. The mentors corrected my plans, not just my answers, and that made all the difference in Advanced.',
      stars: 5,
      image: {
        url: 'https://drive.google.com/file/d/1w8pS86jbXivmX20jHDtZ8_QVRDlm43iv/view?usp=sharing',
        alt: 'Shreshtha Agrawal AIR 140',
      },
    },
    {
      id: 'venkatesh-gupta',
      name: 'Venkatesh Gupta',
      short: 'ISI AIR 17',
      exam: 'Olympiads',
      subject: 'Mathematics',
      year: 2025,
      kind: 'text',
      text: 'Number theory marathons, combinatorics labs and personal feedback loops helped me peak for ISI. Re-Wise kept math joyful even when the pressure was high.',
      stars: 5,
      image: {
        url: 'https://drive.google.com/file/d/1hh6HK0Pt--_lzuOg2D-2RM4bWrViHCw1/view?usp=sharing',
        alt: 'Venkatesh Gupta ISI Rank 17',
      },
    },
  ];
}
