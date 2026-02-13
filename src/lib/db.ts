import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For local Fedora VM: 'postgresql://user:password@localhost:5432/gaming_hub'
  // Use env var for prod/DMZ testing
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  // Later: add transaction helpers if needed
};
