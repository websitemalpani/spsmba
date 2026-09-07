import { prisma } from '@/lib/db';
import { slugify } from '@/lib/slugify';

export type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'date' | 'list';

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  // Virtual fields are rendered in the form but excluded from the base
  // create/update payload — a section's afterSave hook handles them instead
  // (used for relations, e.g. a gallery album's photo list).
  virtual?: boolean;
};

// Minimal shape shared by every Prisma model delegate we drive generically.
type Delegate = {
  findMany: (args?: any) => Promise<any[]>;
  findUnique: (args: any) => Promise<any>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
};

export type SectionConfig = {
  key: string;
  label: string;
  description: string;
  delegate: Delegate;
  fields: FieldConfig[];
  listColumns: string[];
  orderBy: Record<string, 'asc' | 'desc'>;
  slugFrom?: { source: string; target: string };
  afterSave?: (id: number, formData: FormData) => Promise<void>;
  // Enriches a loaded row with virtual field values before rendering the edit
  // form (e.g. pulling a gallery album's photos in from their own table).
  afterLoad?: (row: Record<string, unknown>) => Promise<Record<string, unknown>>;
};

export const sections: SectionConfig[] = [
  {
    key: 'navigation',
    label: 'Navigation',
    description: 'Header menu items, and footer links grouped under Institute / Academics / Admissions / Students.',
    delegate: prisma.navigationItem,
    fields: [
      { name: 'label', label: 'Label', type: 'text', required: true },
      { name: 'href', label: 'Link (href)', type: 'text', required: true },
      {
        name: 'footerGroup',
        label: 'Footer group',
        type: 'text',
        help: 'Leave blank for a header nav item. Otherwise use one of: Institute, Academics, Admissions, Students.',
      },
      { name: 'order', label: 'Order', type: 'number' },
      { name: 'openInNewTab', label: 'Open in new tab', type: 'checkbox' },
    ],
    listColumns: ['label', 'href', 'footerGroup', 'order'],
    orderBy: { order: 'asc' },
  },
  {
    key: 'quick-links',
    label: 'Quick links',
    description: 'The pill buttons shown near the top of the homepage.',
    delegate: prisma.quickLink,
    fields: [
      { name: 'label', label: 'Label', type: 'text', required: true },
      { name: 'href', label: 'Link (href)', type: 'text', required: true },
      { name: 'order', label: 'Order', type: 'number' },
      { name: 'active', label: 'Active', type: 'checkbox' },
    ],
    listColumns: ['label', 'href', 'order', 'active'],
    orderBy: { order: 'asc' },
  },
  {
    key: 'specializations',
    label: 'Specializations',
    description: 'MBA functional specialisation areas.',
    delegate: prisma.specialization,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', help: 'Leave blank to auto-generate from the name.' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'order', label: 'Order', type: 'number' },
      { name: 'active', label: 'Active', type: 'checkbox' },
    ],
    listColumns: ['name', 'slug', 'order', 'active'],
    orderBy: { order: 'asc' },
    slugFrom: { source: 'name', target: 'slug' },
  },
  {
    key: 'facilities',
    label: 'Facilities',
    description: 'Campus facilities shown on the Campus page and homepage.',
    delegate: prisma.facility,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', help: 'Leave blank to auto-generate from the title.' },
      { name: 'shortDescription', label: 'Short tag', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'order', label: 'Order', type: 'number' },
      { name: 'active', label: 'Active', type: 'checkbox' },
    ],
    listColumns: ['title', 'slug', 'order', 'active'],
    orderBy: { order: 'asc' },
    slugFrom: { source: 'title', target: 'slug' },
  },
  {
    key: 'faculty',
    label: 'Faculty',
    description: 'Teaching staff profiles.',
    delegate: prisma.faculty,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', help: 'Leave blank to auto-generate from the name.' },
      { name: 'photoUrl', label: 'Photo URL', type: 'text' },
      { name: 'designation', label: 'Designation', type: 'text' },
      { name: 'qualification', label: 'Qualification', type: 'textarea' },
      { name: 'experience', label: 'Experience', type: 'text' },
      { name: 'specialization', label: 'Specialization', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' },
      { name: 'active', label: 'Active', type: 'checkbox' },
    ],
    listColumns: ['name', 'designation', 'order', 'active'],
    orderBy: { order: 'asc' },
    slugFrom: { source: 'name', target: 'slug' },
  },
  {
    key: 'testimonials',
    label: 'Testimonials & alumni',
    description: 'Alumni/placement cards shown on the Placements page.',
    delegate: prisma.testimonial,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'photoUrl', label: 'Photo URL', type: 'text' },
      { name: 'quote', label: 'Quote', type: 'textarea' },
      { name: 'type', label: 'Type', type: 'text', help: 'Alumni, Student, Recruiter, or Parent.' },
      { name: 'featured', label: 'Featured', type: 'checkbox' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
    listColumns: ['name', 'role', 'company', 'type', 'order'],
    orderBy: { order: 'asc' },
  },
  {
    key: 'documents',
    label: 'Documents',
    description: 'Approvals, notices, fee documents, IQAC reports and committee PDFs — powers the Notices page.',
    delegate: prisma.documentFile,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      {
        name: 'category',
        label: 'Category',
        type: 'text',
        required: true,
        help: 'One of: Approvals & Affiliation, Admissions, Fees, IQAC, Committees.',
      },
      { name: 'academicYear', label: 'Academic year', type: 'text' },
      { name: 'fileUrl', label: 'File URL', type: 'text', required: true },
      { name: 'featured', label: 'Featured', type: 'checkbox' },
      { name: 'published', label: 'Published', type: 'checkbox' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
    listColumns: ['title', 'category', 'academicYear', 'published'],
    orderBy: { category: 'asc' },
  },
  {
    key: 'news',
    label: 'News',
    description: 'News & announcements.',
    delegate: prisma.news,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', help: 'Leave blank to auto-generate from the title.' },
      { name: 'summary', label: 'Summary', type: 'textarea' },
      { name: 'body', label: 'Body', type: 'textarea' },
      { name: 'coverImageUrl', label: 'Cover image URL', type: 'text' },
      { name: 'publishedDate', label: 'Published date', type: 'date' },
      { name: 'featured', label: 'Featured', type: 'checkbox' },
    ],
    listColumns: ['title', 'publishedDate', 'featured'],
    orderBy: { publishedDate: 'desc' },
    slugFrom: { source: 'title', target: 'slug' },
  },
  {
    key: 'events',
    label: 'Events',
    description: 'Campus events and activities.',
    delegate: prisma.event,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', help: 'Leave blank to auto-generate from the title.' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'coverImageUrl', label: 'Cover image URL', type: 'text' },
      { name: 'gallery', label: 'Gallery photo URLs', type: 'list', help: 'One image URL per line.' },
      { name: 'startDate', label: 'Start date', type: 'date' },
      { name: 'endDate', label: 'End date', type: 'date' },
      { name: 'venue', label: 'Venue', type: 'text' },
      { name: 'featured', label: 'Featured', type: 'checkbox' },
    ],
    listColumns: ['title', 'startDate', 'venue'],
    orderBy: { startDate: 'desc' },
    slugFrom: { source: 'title', target: 'slug' },
  },
  {
    key: 'hero-slides',
    label: 'Homepage hero slides',
    description: 'The rotating slides at the top of the homepage.',
    delegate: prisma.heroSlide,
    fields: [
      { name: 'imageUrl', label: 'Image URL', type: 'text', required: true },
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'title', label: 'Title (line 1)', type: 'text', required: true },
      { name: 'accent', label: 'Accent (line 2)', type: 'text' },
      { name: 'copy', label: 'Copy', type: 'textarea' },
      { name: 'buttonLabel', label: 'Button label', type: 'text' },
      { name: 'buttonHref', label: 'Button link', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
    listColumns: ['title', 'accent', 'order'],
    orderBy: { order: 'asc' },
  },
  {
    key: 'photo-captions',
    label: 'Homepage photo strip',
    description: 'The captioned photo strip on the homepage ("A closer look around SPS MBA").',
    delegate: prisma.photoCaption,
    fields: [
      { name: 'imageUrl', label: 'Image URL', type: 'text', required: true },
      { name: 'caption', label: 'Caption', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
    listColumns: ['imageUrl', 'caption', 'order'],
    orderBy: { order: 'asc' },
  },
  {
    key: 'admissions',
    label: 'Admission cycles',
    description: 'Yearly admission process configuration shown on the Admissions page.',
    delegate: prisma.admission,
    fields: [
      { name: 'academicYear', label: 'Academic year', type: 'text', required: true, help: 'e.g. 2026-27' },
      { name: 'instituteCode', label: 'Institute code', type: 'text' },
      { name: 'eligibilityGeneral', label: 'Eligibility (general)', type: 'text' },
      { name: 'eligibilityReserved', label: 'Eligibility (reserved)', type: 'text' },
      { name: 'cetCellUrl', label: 'CET cell URL', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'steps', label: 'Process steps', type: 'list', help: 'One step per line, in order.' },
      { name: 'documentsRequired', label: 'Documents required', type: 'list', help: 'One document per line.' },
      { name: 'active', label: 'Active (shown on the site)', type: 'checkbox' },
    ],
    listColumns: ['academicYear', 'instituteCode', 'active'],
    orderBy: { academicYear: 'desc' },
  },
  {
    key: 'iqac',
    label: 'IQAC records',
    description: 'Yearly IQAC objectives and functions shown on the IQAC page.',
    delegate: prisma.iqac,
    fields: [
      { name: 'academicYear', label: 'Academic year', type: 'text', required: true },
      { name: 'objectives', label: 'Objectives', type: 'list', help: 'One objective per line.' },
      { name: 'functionsDescription', label: 'Functions', type: 'textarea' },
      { name: 'active', label: 'Active (shown on the site)', type: 'checkbox' },
    ],
    listColumns: ['academicYear', 'active'],
    orderBy: { academicYear: 'desc' },
  },
  {
    key: 'gallery',
    label: 'Gallery albums',
    description: 'Photo albums for the campus gallery.',
    delegate: prisma.galleryAlbum,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', help: 'Leave blank to auto-generate from the title.' },
      { name: 'coverImageUrl', label: 'Cover image URL', type: 'text', help: 'Leave blank to use the first photo.' },
      { name: 'featured', label: 'Featured', type: 'checkbox' },
      { name: 'photos', label: 'Photo URLs', type: 'list', required: true, help: 'One image URL per line.', virtual: true },
    ],
    listColumns: ['title', 'slug', 'featured'],
    orderBy: { createdAt: 'desc' },
    slugFrom: { source: 'title', target: 'slug' },
    afterSave: async (id, formData) => {
      const urls = String(formData.get('photos') ?? '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      await prisma.galleryPhoto.deleteMany({ where: { albumId: id } });
      if (urls.length > 0) {
        await prisma.galleryPhoto.createMany({ data: urls.map((url, i) => ({ url, order: i, albumId: id })) });
        const current = await prisma.galleryAlbum.findUnique({ where: { id } });
        if (current && !current.coverImageUrl) {
          await prisma.galleryAlbum.update({ where: { id }, data: { coverImageUrl: urls[0] } });
        }
      }
    },
    afterLoad: async (row) => {
      const photos = await prisma.galleryPhoto.findMany({ where: { albumId: row.id as number }, orderBy: { order: 'asc' } });
      return { ...row, photos: photos.map((p) => p.url) };
    },
  },
];

export function getSection(key: string): SectionConfig | undefined {
  return sections.find((s) => s.key === key);
}

export function slugForSection(section: SectionConfig, formData: FormData): string | undefined {
  if (!section.slugFrom) return undefined;
  const raw = String(formData.get(section.slugFrom.target) ?? '').trim();
  if (raw) return slugify(raw);
  const source = String(formData.get(section.slugFrom.source) ?? '').trim();
  return source ? slugify(source) : undefined;
}
