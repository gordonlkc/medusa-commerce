const http = require('http');
const { execSync } = require('child_process');
const { readFileSync, existsSync } = require('fs');

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

function extractUrlPart(url, pattern) {
  try {
    const re = new RegExp(pattern);
    const m = url.match(re);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url === '/db-status') {
    const dbUrl = process.env.DATABASE_URL || '';
    const dbHost = extractUrlPart(dbUrl, '@([^:/]+)');
    const dbPort = extractUrlPart(dbUrl, ':(\\d{2,5})/') || '5432';
    const dbName = extractUrlPart(dbUrl, '/([^/?]+)') || 'postgres';

    const pgPassword = process.env.PGPASSWORD || '';

    const results = {
      timestamp: new Date().toISOString(),
      dbHost,
      dbPort,
      dbName,
      dns: run(`nslookup ${dbHost || ''}`),
      tcp: run(`timeout 3 nc -zv ${dbHost || ''} ${dbPort}`),
      pgReady: run(`pg_isready -h ${dbHost || ''} -p ${dbPort} -U postgres -d ${dbName}`),
      psqlWithPass: run(`PGPASSWORD='${pgPassword}' timeout 5 psql -h ${dbHost || ''} -p ${dbPort} -U postgres -d ${dbName} -c "SELECT 1 as ok" -w`),
      startupLogs: {
        dns: existsSync('/tmp/startup_dns.log') ? readFileSync('/tmp/startup_dns.log', 'utf8').slice(0, 500) : 'N/A',
        nc: existsSync('/tmp/startup_nc.log') ? readFileSync('/tmp/startup_nc.log', 'utf8').slice(0, 500) : 'N/A',
        pg: existsSync('/tmp/startup_pg.log') ? readFileSync('/tmp/startup_pg.log', 'utf8').slice(0, 500) : 'N/A',
        psql: existsSync('/tmp/startup_psql.log') ? readFileSync('/tmp/startup_psql.log', 'utf8').slice(0, 500) : 'N/A',
      },
    };
    res.end(JSON.stringify(results, null, 2));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Try /db-status' }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.error('[debug-server] listening on ' + PORT);
});
