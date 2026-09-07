import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const schema = z.object({
  name: z.string().min(2).max(100),
  mobile: z.string().min(8).max(20),
  email: z.string().email(),
  city: z.string().max(100).optional(),
  graduation: z.string().max(100).optional(),
  percentage: z.string().optional(),
  cetStatus: z.string().optional(),
  specialization: z.string().optional(),
  message: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Please check the form fields.' }, { status: 400 });

  // Optional fields arrive as '' from untouched <select>/<input> elements — drop
  // empty values instead of writing them as blank strings.
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(parsed.data)) if (v !== undefined && v !== '') clean[k] = v;
  if (typeof clean.percentage === 'string') {
    const n = Number(clean.percentage);
    if (Number.isFinite(n)) clean.percentage = n;
    else delete clean.percentage;
  }

  try {
    await prisma.admissionEnquiry.create({
      data: {
        name: clean.name as string,
        mobile: clean.mobile as string,
        email: clean.email as string,
        city: clean.city as string | undefined,
        graduation: clean.graduation as string | undefined,
        percentage: clean.percentage as number | undefined,
        cetStatus: clean.cetStatus as string | undefined,
        specialization: clean.specialization as string | undefined,
        message: clean.message as string | undefined,
        status: 'New',
        source: 'Website',
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error('Enquiry save failed', e);
    return NextResponse.json({ error: 'Enquiries are temporarily unavailable. Please call us directly.' }, { status: 502 });
  }
}
