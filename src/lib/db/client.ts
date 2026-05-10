import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error('SUPABASE_DB_URL is not set');
}

const client = postgres(connectionString, { prepare: false, max: 10 });

export const db = drizzle(client, { schema });

export { schema };
