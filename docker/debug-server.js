const http = require('http');
const { execSync } = require('child_process');
const { readFileSync, existsSync } = require('fs');
const crypto = require('crypto');

let pg = null;
try { pg = require('pg'); } catch(e) {}

const PORT = 9001;

function run(cmd, opts = {}) {
  try {
    const out = execSync(cmd, { timeout: 5000, encoding: 'utf8', ...opts });
    return { ok: true, data: out.trim().slice(0, 500) };
  } catch (e) {
    const stderr = e.stderr ? e.stderr.toString() : '';
    const stdout = e.stdout ? e.stdout.toString() : '';
    const msg = (stderr || e.message || String(e)).trim().slice(0, 500);
    return { ok: false, data: msg };
  }
}

async function testPgClient(config) {
  if (!pg) return { ok: false, data: 'pg module not available' };
  const client = new pg.Client(config);
  try {
    await Promise.race([
      client.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
    ]);
    const result = await Promise.race([
      client.query('SELECT 1 as ok'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('query timeout')), 10000))
    ]);
    client.end();
    return { ok: true, data: result.rows[0] };
  } catch (e) {
    try { client.end(); } catch(_) {}
    return { ok: false, data: e.message };
  }
}

async function querySchema(config) {
  if (!pg) return { ok: false, data: 'pg module not available' };
  const client = new pg.Client(config);
  try {
    await Promise.race([
      client.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
    ]);
    const columns = await Promise.race([
      client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'region_country'"),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
    ]);
    const pk = await Promise.race([
      client.query("SELECT column_name FROM information_schema.key_column_usage WHERE table_name = 'region_country' AND constraint_name LIKE '%pkey'"),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
    ]);
    client.end();
    return { ok: true, data: { columns: columns.rows, pk: pk.rows } };
  } catch (e) {
    try { client.end(); } catch(_) {}
    return { ok: false, data: e.message };
  }
}

async function queryApiKeys(config) {
  if (!pg) return { ok: false, data: 'pg module not available' };
  const client = new pg.Client(config);
  try {
    await Promise.race([
      client.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
    ]);
    const result = await Promise.race([
      client.query('SELECT id, title, type, token, created_at FROM api_key WHERE type = $1 LIMIT 5', ['publishable']),
      new Promise((_, reject) => setTimeout(() => reject(new Error('query timeout')), 10000))
    ]);
    client.end();
    return { ok: true, data: result.rows };
  } catch (e) {
    try { client.end(); } catch(_) {}
    return { ok: false, data: e.message };
  }
}

function extractFromUrl(url, pattern) {
  const m = String(url).match(new RegExp(pattern));
  return m ? m[1] : null;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url === '/db-status') {
    const dbUrl = process.env.DATABASE_URL || '';
    const dbHost = extractFromUrl(dbUrl, '@([^:/]+)');
    const dbPort = extractFromUrl(dbUrl, ':(\\d{2,5})/') || '5432';
    const dbName = extractFromUrl(dbUrl, '/([^/?]+)') || 'postgres';
    const dbPass = process.env.DB_PASSWORD || '';
    const pgPassword = dbPass || extractFromUrl(dbUrl, ':([^@]+)@') || '';

    const pgConfig = {
      host: dbHost,
      port: parseInt(dbPort) || 5432,
      user: extractFromUrl(process.env.DATABASE_URL || '', '://([^:]+):') || 'postgres',
      password: pgPassword,
      database: 'postgres',
      ssl: dbHost && dbHost.includes('supabase') ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 10000,
    };

    const results = {
      timestamp: new Date().toISOString(),
      dbHost,
      dbPort,
      dbName,
      hasDbPassword: !!dbPass,
      pgConfig: { ...pgConfig, password: pgPassword ? '***' : undefined },
      dns: run(`nslookup ${dbHost || ''}`),
      tcp: run(`timeout 3 nc -zv ${dbHost || ''} ${dbPort}`),
      pgReady: run(`pg_isready -h ${dbHost || ''} -p ${dbPort} -U postgres -d ${dbName}`),
      psqlWithPass: run(`PGPASSWORD='${pgPassword}' timeout 5 psql -h ${dbHost || ''} -p ${dbPort} -U postgres -d ${dbName} -c "SELECT 1 as ok" -w`),
      pgClient: await testPgClient(pgConfig),
      pgClientSupavisorUser: await testPgClient({ ...pgConfig, user: `postgres.lskfndrxkjcaetkvgcco` }),
      medusaApiKeys: await queryApiKeys(pgConfig),
      schema: await querySchema(pgConfig),
      startupLogs: {
        dns: existsSync('/tmp/startup_dns.log') ? readFileSync('/tmp/startup_dns.log', 'utf8').slice(0, 500) : 'N/A',
        nc: existsSync('/tmp/startup_nc.log') ? readFileSync('/tmp/startup_nc.log', 'utf8').slice(0, 500) : 'N/A',
        pg: existsSync('/tmp/startup_pg.log') ? readFileSync('/tmp/startup_pg.log', 'utf8').slice(0, 500) : 'N/A',
        psql: existsSync('/tmp/startup_psql.log') ? readFileSync('/tmp/startup_psql.log', 'utf8').slice(0, 500) : 'N/A',
      },
    };
    res.end(JSON.stringify(results, null, 2));
  } else if (req.url === '/setup-store' && req.method === 'POST') {
    const dbUrl = process.env.DATABASE_URL || '';
    const dbHost = extractFromUrl(dbUrl, '@([^:/]+)');
    const dbPort = extractFromUrl(dbUrl, ':(\\d{2,5})/') || '5432';
    const dbPass = process.env.DB_PASSWORD || '';
    const pgPassword = dbPass || extractFromUrl(dbUrl, ':([^@]+)@') || '';

    const pgConfig = {
      host: dbHost,
      port: parseInt(dbPort) || 5432,
      user: extractFromUrl(dbUrl, '://([^:]+):') || 'postgres',
      password: pgPassword,
      database: 'postgres',
      ssl: dbHost && dbHost.includes('supabase') ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 10000,
    };

    async function setupStore() {
      if (!pg) return { ok: false, data: 'pg module not available' };
      const client = new pg.Client(pgConfig);
      try {
        await Promise.race([
          client.connect(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
        ]);

        const results = {};

        const regions = await Promise.race([
          client.query('SELECT id, name, currency_code FROM region'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
        ]);
        results.regions = regions.rows;

        const regionCountry = await Promise.race([
          client.query('SELECT * FROM region_country'),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
        ]);
        results.regionCountry = regionCountry.rows;

        if (regions.rows.length === 0) {
          const regionId = 'reg_' + crypto.randomUUID().replace(/-/g, '').slice(0, 26);
          await client.query(
            `INSERT INTO region (id, name, currency_code, created_at, updated_at) 
             VALUES ($1, 'United States', 'usd', NOW(), NOW())`,
            [regionId]
          );
          await client.query(
            `INSERT INTO region_country (region_id, iso_2, iso_3, num_code, name, display_name, created_at, updated_at) 
             VALUES ($1, 'us', 'USA', 840, 'United States', 'United States', NOW(), NOW())`,
            [regionId]
          );
          const fsId = 'fset_' + crypto.randomUUID().replace(/-/g, '').slice(0, 26);
          await client.query(
            `INSERT INTO fulfillment_set (id, name, type, created_at, updated_at) 
             VALUES ($1, 'US delivery', 'shipping', NOW(), NOW())`,
            [fsId]
          );
          const szId = 'szone_' + crypto.randomUUID().replace(/-/g, '').slice(0, 26);
          await client.query(
            `INSERT INTO service_zone (id, name, fulfillment_set_id, created_at, updated_at) 
             VALUES ($1, 'US', $2, NOW(), NOW())`,
            [szId, fsId]
          );
          const spId = 'sp_' + crypto.randomUUID().replace(/-/g, '').slice(0, 26);
          await client.query(
            `INSERT INTO shipping_profile (id, name, type, created_at, updated_at) 
             VALUES ($1, 'Default', 'default', NOW(), NOW())`,
            [spId]
          );
          const hash = crypto.createHash('sha256').update('medusa-admin123').digest('hex');
          const userId = 'user_' + crypto.randomUUID().replace(/-/g, '').slice(0, 26);
          await client.query(
            `INSERT INTO user (id, email, password_hash, first_name, last_name, created_at, updated_at, metadata) 
             VALUES ($1, 'admin@medusa.local', $2, 'Admin', 'User', NOW(), NOW(), '{}')`,
            [userId, hash]
          );
          const inviteId = 'inv_' + crypto.randomUUID().replace(/-/g, '').slice(0, 26);
          await client.query(
            `INSERT INTO invite (id, email, role, accepted, created_at, updated_at, token, user_id) 
             VALUES ($1, 'admin@medusa.local', 'admin', true, NOW(), NOW(), 'seed-token', $2)`,
            [inviteId, userId]
          );
          results.created = { regionId, userId, email: 'admin@medusa.local', password: 'medusa-admin123' };
        } else {
          // Delete all existing region_country entries and re-add
          await client.query('DELETE FROM region_country');
          const regionId = regions.rows[0].id;
          await client.query(
            `INSERT INTO region_country (region_id, iso_2, iso_3, num_code, name, display_name, created_at, updated_at) 
             VALUES ($1, 'us', 'USA', 840, 'United States', 'United States', NOW(), NOW())`,
            [regionId]
          );
          results.countryAdded = true;
        }
        }

        client.end();
        return { ok: true, data: results };
      } catch (e) {
        try { client.end(); } catch(_) {}
        return { ok: false, data: e.message };
      }
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const result = await setupStore();
      res.end(JSON.stringify(result, null, 2));
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Try /db-status or POST /setup-store' }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.error('[debug-server] listening on ' + PORT);
});
