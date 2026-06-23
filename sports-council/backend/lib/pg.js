const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5433/sports_council',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function mapRow(row) {
  if (!row) return null;
  const mapped = {};
  for (const key of Object.keys(row)) {
    mapped[toCamelCase(key)] = row[key];
  }
  return mapped;
}

function mapRows(rows) {
  return rows.map(mapRow);
}

async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return {
      ...result,
      rows: mapRows(result.rows),
    };
  } finally {
    client.release();
  }
}

async function queryTx(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

module.exports = {
  query,
  queryTx,
  pool,
};
