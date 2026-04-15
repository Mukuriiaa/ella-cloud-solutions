const { Pool } = require("pg");

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const hasPgParts = Boolean(
  process.env.PGHOST &&
  process.env.PGPORT &&
  process.env.PGDATABASE &&
  process.env.PGUSER &&
  process.env.PGPASSWORD
);

if (!hasDatabaseUrl && !hasPgParts) {
  throw new Error(
    "PostgreSQL config missing. Set DATABASE_URL or PGHOST, PGPORT, PGDATABASE, PGUSER, and PGPASSWORD in .env"
  );
}

function parseBoolean(value) {
  return String(value).toLowerCase() === "true";
}

function shouldUseSsl(connectionString) {
  if (process.env.PGSSL !== undefined) {
    return parseBoolean(process.env.PGSSL)
      ? { rejectUnauthorized: false }
      : false;
  }

  if (!connectionString) {
    return false;
  }

  if (/localhost|127\.0\.0\.1|::1/i.test(connectionString)) {
    return false;
  }

  return { rejectUnauthorized: false };
}

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: shouldUseSsl(process.env.DATABASE_URL),
    }
  : {
      host: process.env.PGHOST,
      port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    };

const pool = new Pool(poolConfig);

async function initDb() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100),
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      service VARCHAR(100),
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await pool.query(createTableQuery);
}

module.exports = {
  pool,
  initDb,
};
