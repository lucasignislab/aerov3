import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../.env.local') });

// Verifica se a variável existe
const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error('❌ SUPABASE_DB_URL não encontrada no .env.local');
  console.error('📍 Certifique-se de ter o arquivo .env.local na raiz do projeto');
  process.exit(1);
}

export default {
  schema: './schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
} satisfies Config;
