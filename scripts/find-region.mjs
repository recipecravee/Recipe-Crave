import postgres from 'postgres';

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-west-1', 'eu-west-2', 'eu-central-1', 'eu-central-2', 'eu-north-1',
  'ap-southeast-1', 'ap-southeast-2', 'ap-south-1', 'ap-northeast-1', 'ap-northeast-2',
  'sa-east-1', 'ca-central-1',
];
const prefixes = ['aws-0', 'aws-1'];
const ports = [6543, 5432];

const password = 'IPPXtZgbArhSYt5F';
const ref = 'kauqukwkqeybmtvvodep';

for (const prefix of prefixes) {
  for (const region of regions) {
    for (const port of ports) {
      const host = `${prefix}-${region}.pooler.supabase.com`;
      const url = `postgresql://postgres.${ref}:${password}@${host}:${port}/postgres`;
      const sql = postgres(url, { prepare: false, max: 1, idle_timeout: 3, connect_timeout: 4 });
      try {
        const r = await sql`select 1 as ok`;
        if (r[0]?.ok === 1) {
          console.log(`\n✓ FOUND: ${prefix}-${region} port ${port}`);
          console.log(`URL: ${url}`);
          await sql.end();
          process.exit(0);
        }
        await sql.end();
      } catch (e) {
        const msg = e.message.slice(0, 50);
        if (!msg.includes('not found') && !msg.includes('ENOTFOUND')) {
          console.log(`${prefix}-${region}:${port} -> ${msg}`);
        }
        try { await sql.end(); } catch {}
      }
    }
  }
}
console.log('\nNo region matched.');
process.exit(1);
