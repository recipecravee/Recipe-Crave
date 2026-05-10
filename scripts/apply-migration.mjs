import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error('SUPABASE_DB_URL not set');
  process.exit(1);
}

const sqlFile = join(__dirname, '..', 'drizzle', '0000_clean_miss_america.sql');
const sqlContent = readFileSync(sqlFile, 'utf8');

// Split on Drizzle's statement-breakpoint marker
const statements = sqlContent
  .split('--> statement-breakpoint')
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

console.log(`Applying ${statements.length} statements...`);

const sql = postgres(url, { prepare: false, max: 1, idle_timeout: 5 });

try {
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    if (!stmt) continue;
    try {
      await sql.unsafe(stmt);
      console.log(`✓ ${i + 1}/${statements.length}`);
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log(`= ${i + 1}/${statements.length} (already exists)`);
      } else {
        console.error(`✗ ${i + 1}/${statements.length}: ${e.message}`);
        throw e;
      }
    }
  }

  // Verify
  const tables = await sql`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `;
  console.log('\n✓ Tables in public schema:');
  tables.forEach((t) => console.log('  -', t.tablename));

  await sql.end();
  process.exit(0);
} catch (e) {
  await sql.end();
  console.error('FAILED:', e.message);
  process.exit(1);
}
