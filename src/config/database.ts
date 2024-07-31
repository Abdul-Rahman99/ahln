/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from 'pg';

import config from '../../config';

const pool = new Pool({
  host: config.DB_HOST,
  database: config.DB_NAME,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  port: parseInt(config.DB_PORT as string, 10),
  max: 4,
});

pool.on('connect', async () => {
  await console.log(`Connected to DB Postgres: ${config.DB_NAME}`);
});

pool.on('error', (error: Error) => {
  console.error(error.message);
});

export default pool;
