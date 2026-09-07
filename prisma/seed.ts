/**
 * Seeds MySQL with the real SPS MBA Institute content (the same content that
 * previously lived in Strapi). Safe to re-run — it clears and re-inserts each
 * table rather than duplicating rows.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  nav,
  specializations,
  facilities,
  faculty,
  alumni,
  documents,
  galleryAlbums,
} from '../lib/content';

const prisma = new PrismaClient();

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('Seeding database...');

  // ---------- Admin login ----------
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@spsmba.edu.in').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-this-password';
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, passwordHash: await bcrypt.hash(adminPassword, 10), name: 'Admin' },
    update: {},
  });
  console.log(`✓ admin login (${adminEmail}) — only created if it didn't already exist`);

  // ---------- Site settings ----------
  await prisma.socialLink.deleteMany({ where: { siteSettingId: 1 } });
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      instituteName: "Shikshan Prasarak Sanstha's M.B.A. Institute",
      shortName: 'SPS MBA Institute',
      tagline: 'Spread Knowledge Unto the Last',
      phone: '(02425) 223181',
      email: 'info@spsmba.edu.in',
      address: 'Ghulewadi, Pune–Nashik Highway (NH-50), Sangamner, District Ahmednagar – 422605, Maharashtra',
      footerText: `© ${new Date().getFullYear()} SPS MBA Institute. All rights reserved.`,
      topBarAddress: 'Sangamner College Campus, Ghulewadi, Sangamner – 422605',
      admissionsStatusLine: 'MBA admissions 2026–27 open',
      metaTitle: 'SPS MBA Institute, Sangamner',
      metaDescription: 'A modern management institute affiliated with Savitribai Phule Pune University.',
      keywords: 'SPS MBA, MBA Sangamner, Shikshan Prasarak Sanstha, MBA Institute Maharashtra',
      socialLinks: {
        create: [
          {
            platform: 'Facebook',
            url: 'https://www.facebook.com/people/Sps-Mba-Sangamner/pfbid0aYJhnqX6bxJuhHbNrYsKRyCPVzRbBGtVtpzoh4fD4PmLkyoEa4durSixtngaE36yl/',
            order: 0,
          },
          { platform: 'Instagram', url: 'https://www.instagram.com/spsmbainstitute/', order: 1 },
          { platform: 'YouTube', url: 'https://www.youtube.com/channel/UC8erfKdVDhEQN4VbIMjb5hg', order: 2 },
        ],
      },
    },
    update: {
      instituteName: "Shikshan Prasarak Sanstha's M.B.A. Institute",
      shortName: 'SPS MBA Institute',
      tagline: 'Spread Knowledge Unto the Last',
      phone: '(02425) 223181',
      email: 'info@spsmba.edu.in',
      address: 'Ghulewadi, Pune–Nashik Highway (NH-50), Sangamner, District Ahmednagar – 422605, Maharashtra',
      footerText: `© ${new Date().getFullYear()} SPS MBA Institute. All rights reserved.`,
      topBarAddress: 'Sangamner College Campus, Ghulewadi, Sangamner – 422605',
      admissionsStatusLine: 'MBA admissions 2026–27 open',
      metaTitle: 'SPS MBA Institute, Sangamner',
      metaDescription: 'A modern management institute affiliated with Savitribai Phule Pune University.',
      keywords: 'SPS MBA, MBA Sangamner, Shikshan Prasarak Sanstha, MBA Institute Maharashtra',
      socialLinks: {
        create: [
          {
            platform: 'Facebook',
            url: 'https://www.facebook.com/people/Sps-Mba-Sangamner/pfbid0aYJhnqX6bxJuhHbNrYsKRyCPVzRbBGtVtpzoh4fD4PmLkyoEa4durSixtngaE36yl/',
            order: 0,
          },
          { platform: 'Instagram', url: 'https://www.instagram.com/spsmbainstitute/', order: 1 },
          { platform: 'YouTube', url: 'https://www.youtube.com/channel/UC8erfKdVDhEQN4VbIMjb5hg', order: 2 },
        ],
      },
    },
  });
  console.log('✓ site settings');

  // ---------- Navigation (main header nav) ----------
  await prisma.navigationItem.deleteMany({ where: { footerGroup: null } });
  await prisma.navigationItem.createMany({
    data: nav.map((n, i) => ({ label: n.label, href: n.href, order: i, footerGroup: null })),
  });

  // ---------- Footer navigation groups ----------
  const footerGroups: Record<string, [string, string][]> = {
    Institute: [
      ['About us', '/about'],
      ['Vision & mission', '/about#vision'],
      ["Chairman's message", '/about#chairman'],
      ['Contact', '/contact'],
    ],
    Academics: [
      ['MBA program', '/academics/mba'],
      ['Specialisations', '/academics/mba#specialisations'],
      ['Faculty', '/faculty'],
      ['Facilities', '/campus/facilities'],
    ],
    Admissions: [
      ['MBA admissions', '/admissions'],
      ['Admission process', '/admissions#process'],
      ['Fees', '/fees'],
      ['Notices', '/notices'],
    ],
    Students: [
      ['Student corner', '/students'],
      ['Gallery', '/gallery'],
      ['IQAC', '/iqac'],
      ['Anti-ragging', '/committees/anti-ragging'],
    ],
  };
  await prisma.navigationItem.deleteMany({ where: { footerGroup: { not: null } } });
  let footerOrder = 100;
  for (const [group, links] of Object.entries(footerGroups)) {
    await prisma.navigationItem.createMany({
      data: links.map(([label, href]) => ({ label, href, order: footerOrder++, footerGroup: group })),
    });
  }
  console.log('✓ navigation');

  // ---------- Specializations ----------
  await prisma.specialization.deleteMany();
  await prisma.specialization.createMany({
    data: specializations.map(([name, description], i) => ({
      name,
      slug: slugify(name),
      description,
      order: i,
      active: true,
    })),
  });
  console.log('✓ specializations');

  // ---------- Facilities ----------
  await prisma.facility.deleteMany();
  await prisma.facility.createMany({
    data: facilities.map((f, i) => ({
      title: f.title,
      slug: slugify(f.title),
      shortDescription: f.tag,
      description: f.text,
      order: i,
      active: true,
    })),
  });
  console.log('✓ facilities');

  // ---------- Faculty ----------
  await prisma.faculty.deleteMany();
  await prisma.faculty.createMany({
    data: faculty.map((f, i) => ({
      name: f.name,
      slug: slugify(f.name),
      photoUrl: f.photo ?? null,
      designation: f.role,
      qualification: f.qual,
      experience: f.exp,
      specialization: f.focus,
      order: i,
      active: true,
    })),
  });
  console.log('✓ faculty');

  // ---------- Alumni -> testimonials ----------
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: alumni.map((a, i) => ({
      name: a.name,
      role: a.role,
      company: a.company,
      photoUrl: a.photo ?? null,
      type: 'Alumni',
      featured: false,
      order: i,
    })),
  });
  console.log('✓ testimonials (alumni)');

  // ---------- Documents ----------
  const CATEGORY_MAP: Record<string, string> = {
    'Approvals & Affiliation': 'Approvals & Affiliation',
    Admissions: 'Admissions',
    Fees: 'Fees',
    IQAC: 'IQAC',
    'Committees 2025–26': 'Committees',
  };
  await prisma.documentFile.deleteMany();
  let docOrder = 0;
  for (const group of documents) {
    const category = CATEGORY_MAP[group.category] || 'Approvals & Affiliation';
    const academicYear = group.category.match(/\d{4}.\d{2,4}/)?.[0];
    await prisma.documentFile.createMany({
      data: group.items.map((item) => ({
        title: item.title,
        category,
        academicYear,
        fileUrl: item.href,
        featured: false,
        published: true,
        order: docOrder++,
      })),
    });
  }
  console.log('✓ documents');

  // ---------- Gallery albums ----------
  await prisma.galleryPhoto.deleteMany();
  await prisma.galleryAlbum.deleteMany();
  for (const album of galleryAlbums) {
    await prisma.galleryAlbum.create({
      data: {
        title: album.title,
        slug: slugify(album.title),
        coverImageUrl: album.photos[0],
        featured: false,
        photos: { create: album.photos.map((url, i) => ({ url, order: i })) },
      },
    });
  }
  console.log('✓ gallery albums');

  // ---------- IQAC ----------
  const iqacData = {
    objectives: [
      'Develop a system for conscious, consistent and catalytic improvement in the overall performance of the institute',
      'Promote measures for institutional functioning towards quality enhancement through internalisation of a quality culture and best practices',
      'Ensure continuous improvement in academic and administrative activities',
    ],
    functionsDescription:
      'The IQAC develops quality benchmarks, facilitates a learner-centric academic environment, organises quality-assurance workshops, collects stakeholder feedback, and prepares the Annual Quality Assurance Report (AQAR) each year.',
    active: true,
  };
  await prisma.iqac.upsert({
    where: { academicYear: '2025-26' },
    create: { academicYear: '2025-26', ...iqacData },
    update: iqacData,
  });
  console.log('✓ IQAC');

  // ---------- Admission cycle ----------
  const admissionData = {
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
    active: true,
  };
  await prisma.admission.upsert({
    where: { academicYear: '2026-27' },
    create: { academicYear: '2026-27', ...admissionData },
    update: admissionData,
  });
  console.log('✓ admission cycle');

  // ---------- Placements page ----------
  const placementsData = {
    processSteps: [
      'Announcement',
      'Registration',
      'Pre-placement talks',
      'Shortlisting',
      'Interviews',
      'Selection',
      'Placement statistics',
    ],
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
  await prisma.placementsPage.upsert({
    where: { id: 1 },
    create: { id: 1, ...placementsData },
    update: placementsData,
  });
  console.log('✓ placements page');

  // ---------- About page ----------
  await prisma.timelineItem.deleteMany();
  const aboutData = {
    foundationEyebrow: 'Our foundation',
    foundationTitle: 'Education that moves communities forward.',
    foundationBody:
      "Established in 1960, Shikshan Prasarak Sanstha aims to provide higher education in rural areas like Sangamner. Sangamner College was founded on January 23, 1961, on Netaji Subhashchandra Bose's birth anniversary.\n\nArts and Commerce courses began in June 1961, followed by Science in June 1965. The institution has since broadened access to vocational and professional education — including B.B.A, B.C.A, B.Voc., Computer Science, MBA, B.Ed, D.Ed and Law.",
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
    chairmanPhotoUrl: '/uploads/2024/01/dr.-sanjay-malpani.jpg',
    approvalsNote:
      "Approved by AICTE, DTE Maharashtra and the Government of India's Ministry of Education. Affiliated to Savitribai Phule Pune University.",
  };
  const timelineItems = [
    { year: '1960', text: 'Shikshan Prasarak Sanstha established', order: 0 },
    { year: '1961', text: 'Sangamner College founded; Arts & Commerce begin', order: 1 },
    { year: '1965', text: 'Science courses introduced', order: 2 },
  ];
  await prisma.aboutPage.upsert({
    where: { id: 1 },
    create: { id: 1, ...aboutData, timeline: { create: timelineItems } },
    update: { ...aboutData, timeline: { create: timelineItems } },
  });
  console.log('✓ about page');

  // ---------- Homepage: hero slider + campus photo strip ----------
  const building = [
    '/uploads/2025/06/New-building-1.jpeg',
    '/uploads/2025/06/New-building-2.jpeg',
    '/uploads/2025/06/New-building-3.jpeg',
  ];
  await prisma.heroSlide.deleteMany();
  await prisma.heroSlide.createMany({
    data: [
      {
        imageUrl: building[0],
        eyebrow: 'Admissions 2026–27 · Now open',
        title: 'An education that',
        accent: 'means business.',
        copy: "A two-year, full-time MBA affiliated to Savitribai Phule Pune University — built on six decades of Shikshan Prasarak Sanstha's commitment to rural access and academic rigour.",
        buttonLabel: 'Apply for 2026–27',
        buttonHref: '/admissions#enquire',
        order: 0,
      },
      {
        imageUrl: building[1],
        eyebrow: 'Welcome to SPS MBA',
        title: 'A campus that',
        accent: 'inspires.',
        copy: 'Discover an academic environment shaped by strong values, experienced faculty and meaningful opportunities to learn beyond the classroom.',
        buttonLabel: 'Explore our campus',
        buttonHref: '/campus/facilities',
        order: 1,
      },
      {
        imageUrl: building[2],
        eyebrow: 'Five specialisation areas',
        title: 'Find your',
        accent: 'direction.',
        copy: 'Develop a broad management foundation and pursue the functional area that aligns with your ambitions.',
        buttonLabel: 'Explore the MBA',
        buttonHref: '/academics/mba',
        order: 2,
      },
    ],
  });
  await prisma.photoCaption.deleteMany();
  await prisma.photoCaption.createMany({
    data: [
      { imageUrl: building[0], caption: 'The Ghulewadi campus', order: 0 },
      { imageUrl: building[1], caption: 'Spaces built to inspire', order: 1 },
      { imageUrl: building[2], caption: 'Where the MBA takes shape', order: 2 },
    ],
  });
  console.log('✓ homepage sections');

  // ---------- Homepage popup (disabled by default) ----------
  await prisma.homepagePopup.upsert({
    where: { id: 1 },
    create: { id: 1, enabled: false },
    update: {},
  });

  console.log('\nSeed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
