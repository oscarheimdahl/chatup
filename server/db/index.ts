import { Client, Pool } from 'pg';
import dbInfo from './clientConfig';

const pool = new Pool({ ...dbInfo });

export const poolQuery = async (query: string) => {
  const client = await pool.connect();
  try {
    await client.query(query);
    return true;
  } catch (e) {
    console.error(e);
    await client.query('ROLLBACK');
    return false;
  } finally {
    await client.release();
  }
};
