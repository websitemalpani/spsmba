/**
 * Downloads every wp-content/uploads media URL referenced in lib/content.ts
 * and prisma/seed.ts into public/uploads/..., then rewrites both files to
 * point at the local copies instead of the live WordPress site.
 *
 * Run with: npx tsx scripts/localize-media.ts
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_FILES = ['lib/content.ts', 'prisma/seed.ts'];
const UPLOADS_RE = /https?:\/\/[^\s'"]+\/wp-content\/uploads\/[^\s'"]+/g;

function localPathFor(url: string): string {
  const marker = '/wp-content/uploads/';
  const idx = url.indexOf(marker);
  const rel = url.slice(idx + marker.length); // e.g. 2025/07/foo.webp
  return `uploads/${rel}`;
}

async function download(url: string, destAbs: string): Promise<boolean> {
  if (existsSync(destAbs)) return true; // resumable — skip what's already there
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(path.dirname(destAbs), { recursive: true });
    writeFileSync(destAbs, buf);
    return true;
  } catch (e: any) {
    console.error(`✗ ${url}: ${e.message}`);
    return false;
  }
}

async function main() {
  const urls = new Set<string>();
  for (const file of TARGET_FILES) {
    const text = readFileSync(path.join(ROOT, file), 'utf8');
    for (const m of text.match(UPLOADS_RE) ?? []) urls.add(m);
  }
  console.log(`Found ${urls.size} media URLs.`);

  const map = new Map<string, string>(); // original URL -> "/uploads/..." site path
  let ok = 0;
  let failed = 0;
  let skipped = 0;
  let i = 0;
  for (const url of urls) {
    i++;
    const rel = localPathFor(url);
    const destAbs = path.join(ROOT, 'public', rel);
    const already = existsSync(destAbs);
    const success = await download(url, destAbs);
    if (success) {
      map.set(url, `/${rel}`);
      if (already) skipped++;
      else ok++;
    } else {
      failed++;
    }
    if (i % 20 === 0) console.log(`  ...${i}/${urls.size}`);
  }
  console.log(`Downloaded ${ok}, already had ${skipped}, failed ${failed}.`);

  for (const file of TARGET_FILES) {
    const abs = path.join(ROOT, file);
    let text = readFileSync(abs, 'utf8');
    for (const [url, local] of map) {
      text = text.split(url).join(local);
    }
    writeFileSync(abs, text);
    console.log(`Rewrote ${file}`);
  }

  writeFileSync(path.join(ROOT, 'scripts', 'media-map.json'), JSON.stringify(Object.fromEntries(map), null, 2));
  console.log('Done. See scripts/media-map.json for the URL -> local path mapping.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
