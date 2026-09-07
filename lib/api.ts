// Server-only data access boundary — backed directly by MySQL via Prisma
// (this app has no separate CMS to talk to). Every function here fails soft:
// if the database is unreachable, reads return empty/null instead of
// throwing, so a DB hiccup never takes the whole site down.
import { prisma } from './db';
import { nav as FALLBACK_NAV } from './content';

export function mediaUrl(url?: string | null): string | null {
  return url || null;
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error('DB read failed:', e);
    return fallback;
  }
}

// ---------- Navigation ----------
export type NavItem = { label: string; href: string; order: number };
export async function getNavigation(): Promise<NavItem[]> {
  const items = await safe(
    () =>
      prisma.navigationItem.findMany({
        where: { footerGroup: null },
        orderBy: { order: 'asc' },
        select: { label: true, href: true, order: true },
      }),
    []
  );
  return items.length > 0 ? items : FALLBACK_NAV.map((n, order) => ({ ...n, order }));
}

// ---------- Quick links ----------
export type QuickLink = { label: string; href: string; order: number };
export async function getQuickLinks(): Promise<QuickLink[]> {
  return safe(
    () =>
      prisma.quickLink.findMany({
        where: { active: true },
        orderBy: { order: 'asc' },
        select: { label: true, href: true, order: true },
      }),
    []
  );
}

const FOOTER_GROUP_ORDER = ['Institute', 'Academics', 'Admissions', 'Students'];
export type FooterGroup = { group: string; items: { label: string; href: string }[] };
const FALLBACK_FOOTER_GROUPS: FooterGroup[] = [
  {
    group: 'Institute',
    items: [
      { label: 'About us', href: '/about' },
      { label: 'Vision & mission', href: '/about#vision' },
      { label: "Chairman's message", href: '/about#chairman' },
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
  const items = await safe(
    () =>
      prisma.navigationItem.findMany({
        where: { footerGroup: { not: null } },
        orderBy: { order: 'asc' },
        select: { label: true, href: true, footerGroup: true },
      }),
    []
  );
  if (items.length === 0) return FALLBACK_FOOTER_GROUPS;
  const groups = new Map<string, FooterGroup>();
  for (const item of items) {
    const group = item.footerGroup!;
    if (!groups.has(group)) groups.set(group, { group, items: [] });
    groups.get(group)!.items.push({ label: item.label, href: item.href });
  }
  return FOOTER_GROUP_ORDER.map((g) => groups.get(g)).filter((g): g is FooterGroup => !!g);
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
export async function getSiteSettings(): Promise<SiteSettings | null> {
  return safe(async () => {
    const s = await prisma.siteSetting.findUnique({
      where: { id: 1 },
      include: { socialLinks: { orderBy: { order: 'asc' } } },
    });
    if (!s) return null;
    return {
      instituteName: s.instituteName,
      shortName: s.shortName,
      tagline: s.tagline,
      phone: s.phone,
      email: s.email,
      address: s.address,
      footerText: s.footerText,
      topBarAddress: s.topBarAddress,
      admissionsStatusLine: s.admissionsStatusLine,
      logo: s.logoUrl,
      favicon: s.faviconUrl,
      socialLinks: s.socialLinks.map((l) => ({ platform: l.platform, url: l.url })),
      seo: { metaTitle: s.metaTitle, metaDescription: s.metaDescription, keywords: s.keywords },
    };
  }, null);
}

// ---------- Specializations ----------
export type Specialization = { name: string; slug: string; description?: string | null; order: number };
export async function getSpecializations(): Promise<Specialization[]> {
  return safe(
    () =>
      prisma.specialization.findMany({
        where: { active: true },
        orderBy: { order: 'asc' },
        select: { name: true, slug: true, description: true, order: true },
      }),
    []
  );
}

// ---------- Facilities ----------
export type Facility = { title: string; slug: string; shortDescription?: string | null; description?: string | null; order: number };
export async function getFacilities(): Promise<Facility[]> {
  return safe(
    () =>
      prisma.facility.findMany({
        where: { active: true },
        orderBy: { order: 'asc' },
        select: { title: true, slug: true, shortDescription: true, description: true, order: true },
      }),
    []
  );
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
  order: number;
};
export async function getFaculty(): Promise<Faculty[]> {
  const rows = await safe(
    () =>
      prisma.faculty.findMany({
        where: { active: true },
        orderBy: { order: 'asc' },
      }),
    []
  );
  return rows.map((f) => ({
    name: f.name,
    slug: f.slug,
    designation: f.designation,
    qualification: f.qualification,
    experience: f.experience,
    specialization: f.specialization,
    photo: f.photoUrl,
    order: f.order,
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
  const rows = await safe(
    () =>
      prisma.testimonial.findMany({
        where: type ? { type } : undefined,
        orderBy: { order: 'asc' },
      }),
    []
  );
  return rows.map((t) => ({ name: t.name, role: t.role, company: t.company, photo: t.photoUrl, type: t.type, order: t.order }));
}

// ---------- Documents, grouped by category (mirrors the old static content shape) ----------
export type DocGroup = { category: string; items: { title: string; href: string; featured: boolean }[] };
const DOCUMENT_CATEGORY_ORDER = ['Approvals & Affiliation', 'Admissions', 'Fees', 'IQAC', 'Committees'];

export async function getDocumentsGrouped(): Promise<DocGroup[]> {
  const docs = await safe(
    () =>
      prisma.documentFile.findMany({
        where: { published: true },
        orderBy: [{ category: 'asc' }, { order: 'asc' }],
      }),
    []
  );

  const groups = new Map<string, DocGroup>();
  for (const d of docs) {
    if (!d.fileUrl) continue;
    const label = d.academicYear ? `${d.category} ${d.academicYear}` : d.category;
    if (!groups.has(d.category)) groups.set(d.category, { category: label, items: [] });
    groups.get(d.category)!.items.push({ title: d.title, href: d.fileUrl, featured: !!d.featured });
  }

  return DOCUMENT_CATEGORY_ORDER.map((c) => groups.get(c)).filter((g): g is DocGroup => !!g);
}

// ---------- Gallery albums ----------
export type GalleryAlbumView = { title: string; photos: string[] };
export async function getGalleryAlbums(): Promise<GalleryAlbumView[]> {
  const albums = await safe(
    () =>
      prisma.galleryAlbum.findMany({
        orderBy: { createdAt: 'desc' },
        include: { photos: { orderBy: { order: 'asc' } } },
      }),
    []
  );
  return albums
    .map((a) => ({ title: a.title, photos: a.photos.map((p) => p.url).filter(Boolean) }))
    .filter((a) => a.photos.length > 0);
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
export async function getActiveAdmission(): Promise<Admission | null> {
  const row = await safe(
    () => prisma.admission.findFirst({ where: { active: true }, orderBy: { academicYear: 'desc' } }),
    null
  );
  if (!row) return null;
  return {
    academicYear: row.academicYear,
    instituteCode: row.instituteCode,
    eligibilityGeneral: row.eligibilityGeneral,
    eligibilityReserved: row.eligibilityReserved,
    cetCellUrl: row.cetCellUrl,
    notes: row.notes,
    steps: (row.steps as string[] | null) ?? [],
    documentsRequired: (row.documentsRequired as string[] | null) ?? [],
  };
}

// ---------- IQAC ----------
export type IqacRecord = { academicYear: string; objectives?: string[]; functionsDescription?: string | null };
export async function getIqacRecord(): Promise<IqacRecord | null> {
  const row = await safe(
    () => prisma.iqac.findFirst({ where: { active: true }, orderBy: { academicYear: 'desc' } }),
    null
  );
  if (!row) return null;
  return {
    academicYear: row.academicYear,
    objectives: (row.objectives as string[] | null) ?? [],
    functionsDescription: row.functionsDescription,
  };
}

// ---------- Placements page ----------
export type PlacementsPage = {
  processSteps?: string[];
  policyRules?: string[];
  prepTitle?: string | null;
  prepBody?: string | null;
  disclaimer?: string | null;
};
export async function getPlacementsPage(): Promise<PlacementsPage | null> {
  const row = await safe(() => prisma.placementsPage.findUnique({ where: { id: 1 } }), null);
  if (!row) return null;
  return {
    processSteps: (row.processSteps as string[] | null) ?? [],
    policyRules: (row.policyRules as string[] | null) ?? [],
    prepTitle: row.prepTitle,
    prepBody: row.prepBody,
    disclaimer: row.disclaimer,
  };
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
export async function getAboutPage(): Promise<AboutPage | null> {
  const row = await safe(
    () => prisma.aboutPage.findUnique({ where: { id: 1 }, include: { timeline: { orderBy: { order: 'asc' } } } }),
    null
  );
  if (!row) return null;
  return {
    foundationEyebrow: row.foundationEyebrow,
    foundationTitle: row.foundationTitle,
    foundationBody: row.foundationBody,
    timeline: row.timeline.map((t) => ({ year: t.year, text: t.text })),
    missionEyebrow: row.missionEyebrow,
    missionTitle: row.missionTitle,
    missionBody: row.missionBody,
    missionQuote: row.missionQuote,
    visionBody: row.visionBody,
    chairmanQuote: row.chairmanQuote,
    chairmanBody: row.chairmanBody,
    chairmanName: row.chairmanName,
    chairmanTitle: row.chairmanTitle,
    chairmanPhoto: row.chairmanPhotoUrl,
    approvalsNote: row.approvalsNote,
  };
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
export async function getHomepageSections(): Promise<{ heroSlides: HeroSlide[]; photoCaptions: PhotoCaption[] }> {
  const [slides, captions] = await safe(
    () =>
      Promise.all([
        prisma.heroSlide.findMany({ orderBy: { order: 'asc' } }),
        prisma.photoCaption.findMany({ orderBy: { order: 'asc' } }),
      ]),
    [[], []] as [Awaited<ReturnType<typeof prisma.heroSlide.findMany>>, Awaited<ReturnType<typeof prisma.photoCaption.findMany>>]
  );
  return {
    heroSlides: slides.map((s) => ({
      image: s.imageUrl,
      eyebrow: s.eyebrow ?? undefined,
      title: s.title,
      accent: s.accent ?? undefined,
      copy: s.copy ?? undefined,
      buttonLabel: s.buttonLabel ?? undefined,
      buttonHref: s.buttonHref ?? undefined,
      order: s.order,
    })),
    photoCaptions: captions.map((c) => ({ image: c.imageUrl, caption: c.caption ?? undefined, order: c.order })),
  };
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
export async function getHomepagePopup(): Promise<HomepagePopup | null> {
  const popup = await safe(() => prisma.homepagePopup.findUnique({ where: { id: 1 } }), null);
  if (!popup?.enabled) return null;
  const today = new Date().toISOString().slice(0, 10);
  if (popup.startDate && today < popup.startDate.toISOString().slice(0, 10)) return null;
  if (popup.endDate && today > popup.endDate.toISOString().slice(0, 10)) return null;
  return {
    id: popup.id,
    updatedAt: popup.updatedAt.toISOString(),
    title: popup.title,
    message: popup.message,
    image: popup.imageUrl,
    buttonLabel: popup.buttonLabel,
    buttonHref: popup.buttonHref,
  };
}

// ---------- News & Events (homepage blog/events tabs + detail pages) ----------
export type NewsItem = {
  title: string;
  slug: string;
  summary?: string;
  body?: string;
  coverImage?: string | null;
  publishedDate?: string;
};
export async function getNews(limit = 50): Promise<NewsItem[]> {
  const rows = await safe(
    () => prisma.news.findMany({ orderBy: { publishedDate: 'desc' }, take: limit }),
    []
  );
  return rows.map((n) => ({
    title: n.title,
    slug: n.slug,
    summary: n.summary ?? undefined,
    body: n.body ?? undefined,
    coverImage: n.coverImageUrl,
    publishedDate: n.publishedDate?.toISOString(),
  }));
}
export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const n = await safe(() => prisma.news.findUnique({ where: { slug } }), null);
  if (!n) return null;
  return {
    title: n.title,
    slug: n.slug,
    summary: n.summary ?? undefined,
    body: n.body ?? undefined,
    coverImage: n.coverImageUrl,
    publishedDate: n.publishedDate?.toISOString(),
  };
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
export async function getEvents(limit = 50): Promise<EventItem[]> {
  const rows = await safe(
    () => prisma.event.findMany({ orderBy: { startDate: 'desc' }, take: limit }),
    []
  );
  return rows.map((e) => ({
    title: e.title,
    slug: e.slug,
    description: e.description ?? undefined,
    coverImage: e.coverImageUrl,
    gallery: (e.gallery as string[] | null) ?? [],
    startDate: e.startDate?.toISOString(),
    endDate: e.endDate?.toISOString(),
    venue: e.venue ?? undefined,
  }));
}
export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const e = await safe(() => prisma.event.findUnique({ where: { slug } }), null);
  if (!e) return null;
  return {
    title: e.title,
    slug: e.slug,
    description: e.description ?? undefined,
    coverImage: e.coverImageUrl,
    gallery: (e.gallery as string[] | null) ?? [],
    startDate: e.startDate?.toISOString(),
    endDate: e.endDate?.toISOString(),
    venue: e.venue ?? undefined,
  };
}
