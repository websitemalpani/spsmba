// Server-only data access boundary — now backed entirely by static content
// (no database, no CMS). Every function keeps the exact same name/signature/
// return shape it had when it queried Prisma, so every page and component is
// unchanged. Source content lives in `lib/content.ts`; a few sections that
// only ever had one record (site settings, about page, admissions, IQAC,
// placements, homepage sections) are defined here as literals.
import { slugify } from './slugify';
import {
  nav as NAV,
  specializations as SPECIALIZATIONS,
  facilities as FACILITIES,
  faculty as FACULTY,
  alumni as ALUMNI,
  documents as DOCUMENTS,
  galleryAlbums as GALLERY_ALBUMS,
  cdcMembers as CDC_MEMBERS,
  quickLinks as QUICK_LINKS,
} from './content';

export function mediaUrl(url?: string | null): string | null {
  return url || null;
}

// ---------- Navigation ----------
export type NavItem = { label: string; href: string; order: number };
export async function getNavigation(): Promise<NavItem[]> {
  return NAV.map((n, order) => ({ ...n, order }));
}

// ---------- Quick links ----------
export type QuickLink = { label: string; href: string; order: number };
export async function getQuickLinks(): Promise<QuickLink[]> {
  return QUICK_LINKS.map((q, order) => ({ ...q, order }));
}

export type FooterGroup = { group: string; items: { label: string; href: string }[] };
const FOOTER_GROUPS: FooterGroup[] = [
  {
    group: 'Institute',
    items: [
      { label: 'About us', href: '/about' },
      { label: 'Vision & mission', href: '/about#vision' },
      { label: "Chairman's message", href: '/about#chairman' },
      { label: 'College Development Committee', href: '/committees/college-development-committee' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    group: 'Academics',
    items: [
      { label: 'MBA program', href: '/academics/mba' },
      { label: 'Specialisations', href: '/academics/mba#specialisations' },
      { label: 'Faculty', href: '/faculty' },
      { label: 'Facilities', href: '/campus/facilities' },
    ],
  },
  {
    group: 'Admissions',
    items: [
      { label: 'MBA admissions', href: '/admissions' },
      { label: 'Admission process', href: '/admissions#process' },
      { label: 'Fees', href: '/fees' },
      { label: 'Notices', href: '/notices' },
    ],
  },
  {
    group: 'Students',
    items: [
      { label: 'Student corner', href: '/students' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'IQAC', href: '/iqac' },
      { label: 'Anti-ragging', href: '/committees/anti-ragging' },
    ],
  },
];
export async function getFooterNavigation(): Promise<FooterGroup[]> {
  return FOOTER_GROUPS;
}

// ---------- Site settings ----------
export type SiteSettings = {
  instituteName?: string | null;
  shortName?: string | null;
  tagline?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  footerText?: string | null;
  topBarAddress?: string | null;
  admissionsStatusLine?: string | null;
  logo?: string | null;
  favicon?: string | null;
  socialLinks?: { platform: string; url: string }[];
  seo?: { metaTitle?: string | null; metaDescription?: string | null; keywords?: string | null };
};
const SITE_SETTINGS: SiteSettings = {
  instituteName: "Shikshan Prasarak Sanstha's M.B.A. Institute",
  shortName: 'SPS MBA Institute',
  tagline: 'Spread Knowledge Unto the Last',
  phone: '(02425) 223181',
  email: 'info@spsmba.edu.in',
  address: 'Ghulewadi, Pune–Nashik Highway (NH-50), Sangamner, District Ahmednagar – 422605, Maharashtra',
  footerText: `© ${new Date().getFullYear()} SPS MBA Institute. All rights reserved.`,
  topBarAddress: 'Sangamner College Campus, Ghulewadi, Sangamner – 422605',
  admissionsStatusLine: 'MBA admissions 2026–27 open',
  logo: null,
  favicon: null,
  socialLinks: [
    {
      platform: 'Facebook',
      url: 'https://www.facebook.com/people/Sps-Mba-Sangamner/pfbid0aYJhnqX6bxJuhHbNrYsKRyCPVzRbBGtVtpzoh4fD4PmLkyoEa4durSixtngaE36yl/',
    },
    { platform: 'Instagram', url: 'https://www.instagram.com/spsmbainstitute/' },
    { platform: 'YouTube', url: 'https://www.youtube.com/channel/UC8erfKdVDhEQN4VbIMjb5hg' },
  ],
  seo: {
    metaTitle: 'SPS MBA Institute, Sangamner',
    metaDescription: 'A modern management institute affiliated with Savitribai Phule Pune University.',
    keywords: 'SPS MBA, MBA Sangamner, Shikshan Prasarak Sanstha, MBA Institute Maharashtra',
  },
};
export async function getSiteSettings(): Promise<SiteSettings | null> {
  return SITE_SETTINGS;
}

// ---------- Specializations ----------
export type Specialization = { name: string; slug: string; description?: string | null; order: number };
export async function getSpecializations(): Promise<Specialization[]> {
  return SPECIALIZATIONS.map(([name, description], order) => ({ name, slug: slugify(name), description, order }));
}

// ---------- Facilities ----------
export type Facility = { title: string; slug: string; shortDescription?: string | null; description?: string | null; photos: string[]; order: number };
export async function getFacilities(): Promise<Facility[]> {
  return FACILITIES.map((f, order) => ({
    title: f.title,
    slug: slugify(f.title),
    shortDescription: f.tag,
    description: f.text,
    photos: f.photos ?? [],
    order,
  }));
}

// ---------- Faculty ----------
export type Faculty = {
  name: string;
  slug: string;
  designation?: string | null;
  qualification?: string | null;
  experience?: string | null;
  specialization?: string | null;
  photo?: string | null;
  department: string;
  order: number;
};
export async function getFaculty(): Promise<Faculty[]> {
  return FACULTY.map((f, order) => ({
    name: f.name,
    slug: slugify(f.name),
    designation: f.role,
    qualification: f.qual,
    experience: f.exp,
    specialization: f.focus,
    photo: f.photo ?? null,
    department: f.dept,
    order,
  }));
}

// ---------- Testimonials (alumni, etc.) ----------
export type Testimonial = {
  name: string;
  role?: string | null;
  company?: string | null;
  photo?: string | null;
  type: string;
  order: number;
};
export async function getTestimonials(type?: string): Promise<Testimonial[]> {
  const rows = ALUMNI.map((a, order) => ({
    name: a.name,
    role: a.role,
    company: a.company,
    photo: a.photo ?? null,
    type: 'Alumni',
    order,
  }));
  return type ? rows.filter((r) => r.type === type) : rows;
}

// ---------- Documents, grouped by category ----------
export type DocGroup = { category: string; items: { title: string; href: string; featured: boolean }[] };
const DOCUMENT_CATEGORY_ORDER = ['Approvals & Affiliation', 'Admissions', 'Fees', 'IQAC', 'Committees'];
const DOCUMENT_CATEGORY_MAP: Record<string, string> = {
  'Approvals & Affiliation': 'Approvals & Affiliation',
  Admissions: 'Admissions',
  Fees: 'Fees',
  IQAC: 'IQAC',
  'Committees 2025–26': 'Committees',
};

export async function getDocumentsGrouped(): Promise<DocGroup[]> {
  const groups = new Map<string, DocGroup>();
  for (const group of DOCUMENTS) {
    const category = DOCUMENT_CATEGORY_MAP[group.category] || 'Approvals & Affiliation';
    const academicYear = group.category.match(/\d{4}.\d{2,4}/)?.[0];
    const label = academicYear ? `${category} ${academicYear}` : category;
    if (!groups.has(category)) groups.set(category, { category: label, items: [] });
    for (const item of group.items) {
      groups.get(category)!.items.push({ title: item.title, href: item.href, featured: false });
    }
  }
  return DOCUMENT_CATEGORY_ORDER.map((c) => groups.get(c)).filter((g): g is DocGroup => !!g);
}

// ---------- College Development Committee ----------
export type CdcMember = { name: string; role: string };
export async function getCdcMembers(): Promise<CdcMember[]> {
  return CDC_MEMBERS;
}

// ---------- Gallery albums ----------
export type GalleryAlbumView = { title: string; photos: string[] };
export async function getGalleryAlbums(): Promise<GalleryAlbumView[]> {
  return GALLERY_ALBUMS.map((a) => ({ title: a.title, photos: a.photos.filter(Boolean) })).filter(
    (a) => a.photos.length > 0
  );
}

// ---------- Admission cycle ----------
export type Admission = {
  academicYear: string;
  instituteCode?: string | null;
  eligibilityGeneral?: string | null;
  eligibilityReserved?: string | null;
  cetCellUrl?: string | null;
  notes?: string | null;
  steps?: string[];
  documentsRequired?: string[];
};
const ACTIVE_ADMISSION: Admission = {
  academicYear: '2026-27',
  instituteCode: 'MB5521',
  eligibilityGeneral: '50% aggregate',
  eligibilityReserved: '45% aggregate',
  cetCellUrl: 'https://cetcell.mahacet.org/',
  notes:
    "Candidates must be Indian nationals who have appeared and qualified MAH-MBA-CET for the relevant year, or hold a valid CMAT / CAT score, along with any bachelor's degree.",
  steps: [
    'Register online with the State CET Cell',
    'Submit institute preferences',
    'Complete document verification at your allotted Facilitation Centre',
    'State authorities publish the merit list',
    'State CET Cell releases the admission allotment',
    'Report to the allotted institute within the given timeframe',
    'Submit your application form and complete admission reporting the same day',
  ],
  documentsRequired: [
    'Entrance exam (MAH-MBA-CET / CMAT / CAT) scorecard',
    'FC confirmation letter',
    'Degree mark statements and passing certificate',
    'Transfer and leaving certificate',
    'Migration certificate (if applicable)',
    'Nationality and domicile certificate (if applicable)',
    'Caste certificate (reserved categories)',
    'Gap certificate, if applicable',
    'SSC / HSC marksheets',
    'Income certificate (reserved categories)',
    'Disability certificate (if applicable)',
    'Passport-size photographs and Aadhar card',
  ],
};
export async function getActiveAdmission(): Promise<Admission | null> {
  return ACTIVE_ADMISSION;
}

// ---------- IQAC ----------
export type IqacRecord = { academicYear: string; objectives?: string[]; functionsDescription?: string | null };
const IQAC_RECORD: IqacRecord = {
  academicYear: '2025-26',
  objectives: [
    'Develop a system for conscious, consistent and catalytic improvement in the overall performance of the institute',
    'Promote measures for institutional functioning towards quality enhancement through internalisation of a quality culture and best practices',
    'Ensure continuous improvement in academic and administrative activities',
  ],
  functionsDescription:
    'The IQAC develops quality benchmarks, facilitates a learner-centric academic environment, organises quality-assurance workshops, collects stakeholder feedback, and prepares the Annual Quality Assurance Report (AQAR) each year.',
};
export async function getIqacRecord(): Promise<IqacRecord | null> {
  return IQAC_RECORD;
}

// ---------- Placements page ----------
export type PlacementsPage = {
  processSteps?: string[];
  policyRules?: string[];
  prepTitle?: string | null;
  prepBody?: string | null;
  disclaimer?: string | null;
};
const PLACEMENTS_PAGE: PlacementsPage = {
  processSteps: ['Announcement', 'Registration', 'Pre-placement talks', 'Shortlisting', 'Interviews', 'Selection', 'Placement statistics'],
  policyRules: [
    'Students may apply to multiple companies until they receive their first offer — after accepting an offer, they must not apply to other companies.',
    'False information in resumes or manipulated documents leads to disqualification.',
    'Misconduct or indiscipline during the placement process leads to disqualification.',
    'Absenteeism from interviews without prior notice, or not joining after accepting an offer, leads to disqualification.',
  ],
  prepTitle: 'Pre-placement preparation',
  prepBody:
    'The placement cell runs résumé-building workshops, interview preparation sessions, mock interviews and personality development programmes to enhance student employability, alongside internships, live projects, industrial visits and guest lectures.',
  disclaimer:
    'Placement outcomes shown reflect students individually placed following recruitment drives; overall placement statistics are published once verified data is available.',
};
export async function getPlacementsPage(): Promise<PlacementsPage | null> {
  return PLACEMENTS_PAGE;
}

// ---------- About page ----------
export type AboutPage = {
  foundationEyebrow?: string | null;
  foundationTitle?: string | null;
  foundationBody?: string | null;
  timeline?: { year: string; text: string }[];
  missionEyebrow?: string | null;
  missionTitle?: string | null;
  missionBody?: string | null;
  missionQuote?: string | null;
  visionBody?: string | null;
  chairmanQuote?: string | null;
  chairmanBody?: string | null;
  chairmanName?: string | null;
  chairmanTitle?: string | null;
  chairmanPhoto?: string | null;
  approvalsNote?: string | null;
};
const ABOUT_PAGE: AboutPage = {
  foundationEyebrow: 'Our foundation',
  foundationTitle: 'Education that moves communities forward.',
  foundationBody:
    "Established in 1960, Shikshan Prasarak Sanstha aims to provide higher education in rural areas like Sangamner. Sangamner College was founded on January 23, 1961, on Netaji Subhashchandra Bose's birth anniversary.\n\nArts and Commerce courses began in June 1961, followed by Science in June 1965. The institution has since broadened access to vocational and professional education — including B.B.A, B.C.A, B.Voc., Computer Science, MBA, B.Ed, D.Ed and Law.",
  timeline: [
    { year: '1960', text: 'Shikshan Prasarak Sanstha established' },
    { year: '1961', text: 'Sangamner College founded; Arts & Commerce begin' },
    { year: '1965', text: 'Science courses introduced' },
  ],
  missionEyebrow: 'Mission',
  missionTitle: 'Uplift disadvantaged rural youth.',
  missionBody:
    'The Sanstha\'s guiding objective is to "uplift disadvantaged rural youth, considering local social circumstances," carried forward under one core principle:',
  missionQuote: 'Think globally, act locally.',
  visionBody:
    'We aim to make local excellence globally competitive through innovative and skill-based programmes for students from diverse cultural backgrounds, nurturing spiritual, moral, intellectual, social, emotional and physical development through value-based education.',
  chairmanQuote:
    'Our institution believes in bringing about changes that are a need of the time but also cherishes eternal values.',
  chairmanBody:
    "Human resources are the real wealth of this institution. We advocate experiential learning that goes beyond the classroom walls to build every student's confidence for the world of business.",
  chairmanName: 'Dr. Sanjay Malpani',
  chairmanTitle: 'Chairman, Shikshan Prasarak Sanstha',
  chairmanPhoto: '/uploads/2024/01/dr.-sanjay-malpani.jpg',
  approvalsNote:
    "Approved by AICTE, DTE Maharashtra and the Government of India's Ministry of Education. Affiliated to Savitribai Phule Pune University.",
};
export async function getAboutPage(): Promise<AboutPage | null> {
  return ABOUT_PAGE;
}

// ---------- Homepage dynamic sections ----------
export type HeroSlide = {
  image: string | null;
  eyebrow?: string;
  title: string;
  accent?: string;
  copy?: string;
  buttonLabel?: string;
  buttonHref?: string;
  order: number;
};
export type PhotoCaption = { image: string | null; caption?: string; order: number };
const BUILDING_PHOTOS = ['/uploads/2025/06/New-building-1.jpeg', '/uploads/2025/06/New-building-2.jpeg', '/uploads/2025/06/New-building-3.jpeg'];
const SLIDER_PHOTOS = ['/images/slider/1.jpg', '/images/slider/2.jpg', '/images/slider/3.jpg', '/images/slider/4.jpg'];
const HERO_SLIDES: HeroSlide[] = [
  {
    image: SLIDER_PHOTOS[0],
    eyebrow: 'Admissions 2026–27 · Now open',
    title: 'An education that',
    accent: 'means business.',
    copy: "A two-year, full-time MBA affiliated to Savitribai Phule Pune University — built on six decades of Shikshan Prasarak Sanstha's commitment to rural access and academic rigour.",
    buttonLabel: 'Apply for 2026–27',
    buttonHref: '/admissions#enquire',
    order: 0,
  },
  {
    image: SLIDER_PHOTOS[1],
    eyebrow: 'Welcome to SPS MBA',
    title: 'A campus that',
    accent: 'inspires.',
    copy: 'Discover an academic environment shaped by strong values, experienced faculty and meaningful opportunities to learn beyond the classroom.',
    buttonLabel: 'Explore our campus',
    buttonHref: '/campus/facilities',
    order: 1,
  },
  {
    image: SLIDER_PHOTOS[2],
    eyebrow: 'Five specialisation areas',
    title: 'Find your',
    accent: 'direction.',
    copy: 'Develop a broad management foundation and pursue the functional area that aligns with your ambitions.',
    buttonLabel: 'Explore the MBA',
    buttonHref: '/academics/mba',
    order: 2,
  },
  {
    image: SLIDER_PHOTOS[3],
    eyebrow: 'Meet our faculty',
    title: 'Learn from',
    accent: 'mentors who guide.',
    copy: 'Ph.D.-qualified faculty with real industry grounding invest in every cohort, from the classroom through to placement.',
    buttonLabel: 'Meet the faculty',
    buttonHref: '/faculty',
    order: 3,
  },
];
const PHOTO_CAPTIONS: PhotoCaption[] = [
  { image: BUILDING_PHOTOS[0], caption: 'The Ghulewadi campus', order: 0 },
  { image: BUILDING_PHOTOS[1], caption: 'Spaces built to inspire', order: 1 },
  { image: BUILDING_PHOTOS[2], caption: 'Where the MBA takes shape', order: 2 },
];
export async function getHomepageSections(): Promise<{ heroSlides: HeroSlide[]; photoCaptions: PhotoCaption[] }> {
  return { heroSlides: HERO_SLIDES, photoCaptions: PHOTO_CAPTIONS };
}

// ---------- Homepage popup ----------
export type HomepagePopup = {
  id: number;
  updatedAt: string;
  title?: string | null;
  message?: string | null;
  image?: string | null;
  buttonLabel?: string | null;
  buttonHref?: string | null;
};
// Disabled by default, matching the previous seeded default.
export async function getHomepagePopup(): Promise<HomepagePopup | null> {
  return null;
}

// ---------- News & Events (homepage blog/events tabs + detail pages) ----------
// No static content authored yet — kept empty like the previous DB state.
export type NewsItem = {
  title: string;
  slug: string;
  summary?: string;
  body?: string;
  coverImage?: string | null;
  publishedDate?: string;
};
export async function getNews(_limit = 50): Promise<NewsItem[]> {
  return [];
}
export async function getNewsBySlug(_slug: string): Promise<NewsItem | null> {
  return null;
}

export type EventItem = {
  title: string;
  slug: string;
  description?: string;
  coverImage?: string | null;
  gallery?: string[];
  startDate?: string;
  endDate?: string;
  venue?: string;
};
export async function getEvents(_limit = 50): Promise<EventItem[]> {
  return [];
}
export async function getEventBySlug(_slug: string): Promise<EventItem | null> {
  return null;
}
