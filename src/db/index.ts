import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import * as schemas from './schemas/schema';

config({ path: '.env' });

export const db = drizzle({
  connection: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  schema: {
    user: schemas.user,
    session: schemas.session,
    account: schemas.account,
    verification: schemas.verification,
  },
  relations: schemas.relations,
});
