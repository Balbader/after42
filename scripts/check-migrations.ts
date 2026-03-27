import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

config({ path: '.env' });

async function main() {
  const db = drizzle({
    connection: {
      url: process.env.TURSO_CONNECTION_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    },
  });
  
  const rows = await db.run({ sql: 'SELECT * FROM __drizzle_migrations ORDER BY created_at', args: [] });
  console.log(JSON.stringify(rows.rows, null, 2));
}
main().catch(console.error);
