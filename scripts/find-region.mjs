import postgres from 'postgres';

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-west-1', 'eu-central-1', 'eu-north-1',
  'ap-southeast-1', 'ap-southeast-2', 'ap-south-1', 'ap-northeast-1',
  'sa-east-1', 'ca-central-1',
];

const password = process.env.SUPABASE_DB_PASSWORD ?? 'IPPXtZgbArhSYt5F';
const ref = 'kauqukwkqeybmtvvodep';

for (const region of regions) {
  const url = `postgresql://postgres.${ref}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres`;
  const sql = postgres(url, { prepare: false, max: 1, idle_timeout: 5, connect_timeout: 5 });
  try {
    const r = await sql`select 1 as ok`;
    if (r[0]?.ok === 1) {
      console.log(`FOUND: aws-0-${region}.pooler.supabase.com`);
      await sql.end();
      process.exit(0);
    }
    await sql.end();
  } catch (e) {
    console.log(`miss ${region}: ${e.message.slice(0, 60)}`);
    try { await sql.end(); } catch {}
  }
}
console.log('No region matched.');
process.exit(1);
