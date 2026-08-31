const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_9TrcwQqMo4eU@ep-shiny-river-aemn37x4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

const MIME_MAP = {
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function getAllFiles(dir, baseDir = '') {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = baseDir ? `${baseDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, relPath));
    } else {
      files.push({ fullPath, relPath: '/' + relPath.replace(/\\/g, '/') });
    }
  }
  return files;
}

async function seedAssets() {
  console.log('Connecting to Neon PostgreSQL for asset seeding...');
  const sql = neon(DATABASE_URL);

  const publicDir = path.join(__dirname, '..', 'public');
  const allFiles = getAllFiles(publicDir);

  console.log(`Found ${allFiles.length} asset files to seed.`);

  let processed = 0;
  let skipped = 0;
  let totalBytes = 0;
  const CONCURRENCY = 15;

  async function uploadFile(file) {
    const ext = path.extname(file.fullPath).toLowerCase();
    const mime = MIME_MAP[ext] || 'application/octet-stream';
    const filename = path.basename(file.fullPath);
    
    // Determine category
    let category = 'general';
    if (file.relPath.includes('/icons xp/Windows XP Icons/')) category = 'Windows XP Icons';
    else if (file.relPath.includes('/icons xp/Whistler Icons/')) category = 'Whistler Icons';
    else if (file.relPath.includes('/icons xp/Longhorn Icons/')) category = 'Longhorn Icons';
    else if (file.relPath.includes('/icons xp/Service Pack 2 Beta Icons/')) category = 'SP2 Beta Icons';
    else if (ext === '.gif') category = 'GIF Animation';
    else if (ext === '.jpg' || ext === '.jpeg') category = 'Wallpaper';

    try {
      const buffer = fs.readFileSync(file.fullPath);
      const dataBase64 = buffer.toString('base64');
      const sizeBytes = buffer.length;
      totalBytes += sizeBytes;

      await sql`
        INSERT INTO system_assets (id, filename, category, mime_type, data, size_bytes)
        VALUES (${file.relPath}, ${filename}, ${category}, ${mime}, ${dataBase64}, ${sizeBytes})
        ON CONFLICT (id) DO UPDATE SET
          filename = EXCLUDED.filename,
          category = EXCLUDED.category,
          mime_type = EXCLUDED.mime_type,
          data = EXCLUDED.data,
          size_bytes = EXCLUDED.size_bytes;
      `;
      processed++;
    } catch (err) {
      console.error(`Error uploading ${file.relPath}:`, err.message);
      skipped++;
    }
  }

  // Process in chunks
  for (let i = 0; i < allFiles.length; i += CONCURRENCY) {
    const chunk = allFiles.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(uploadFile));
    const percent = Math.round(((i + chunk.length) / allFiles.length) * 100);
    process.stdout.write(`\rProgress: ${percent}% (${processed}/${allFiles.length} files, ${(totalBytes / (1024 * 1024)).toFixed(2)} MB)...`);
  }

  console.log(`\n\n✅ Asset migration complete!`);
  console.log(`- Uploaded: ${processed} assets`);
  console.log(`- Total data migrated: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);

  // Verify count from DB
  const [countRes] = await sql`SELECT count(*) as total, sum(size_bytes) as total_size FROM system_assets;`;
  console.log(`- DB Verification: ${countRes.total} assets in database (${(Number(countRes.total_size) / (1024 * 1024)).toFixed(2)} MB)`);
}

seedAssets().catch((err) => {
  console.error('Asset seeding failed:', err);
  process.exit(1);
});
