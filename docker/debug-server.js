const http = require('http');
const { execSync } = require('child_process');
const { readFileSync, existsSync } = require('fs');

const PORT = 9001;

function run(cmd) {
  try {
    const out = execSync(cmd, { timeout: 5000, encoding: 'utf8' });
    return { ok: true, data: out.trim().slice(0, 500) };
  } catch (e) {
    return { ok: false, data: (e.stderr || e.message || String(e)).trim().slice(0, 500) };
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url === '/db-status') {
    const dbHost = (process.env.DATABASE_URL || '').replace(/.*@([^/]+)\/.*/, '$1').replace(/:\d+$/, '');
    const dbPort = (process.env.DATABASE_URL || '').replace(/.*@[^:]+:(\d+)\/.*/, '$1') || '5432';
    const dbName = (process.env.DATABASE_URL || '').replace(/.*/([^?]+)(\?.*)?/, '$1') || 'postgres';

    const results = {
      timestamp: new Date().toISOString(),
      dbHost,
      dbPort,
      dbName,
      dns: run(`nslookup ${dbHost}`),
      tcp: run(`timeout 3 nc -zv ${dbHost} ${dbPort}`),
      pgReady: run(`pg_isready -h ${dbHost} -p ${dbPort} -U postgres -d ${dbName}`),
      startupLogs: existsSync('/tmp/startup_dns.log') ? {
        dns: readFileSync('/tmp/startup_dns.log', 'utf8').slice(0, 500),
        nc: existsSync('/tmp/startup_nc.log') ? readFileSync('/tmp/startup_nc.log', 'utf8').slice(0, 500) : 'N/A',
        pg: existsSync('/tmp/startup_pg.log') ? readFileSync('/tmp/startup_pg.log', 'utf8').slice(0, 500) : 'N/A',
        psql: existsSync('/tmp/startup_psql.log') ? readFileSync('/tmp/startup_psql.log', 'utf8').slice(0, 500) : 'N/A',
      } : 'No startup logs yet',
    };
    res.end(JSON.stringify(results, null, 2));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found. Try /db-status' }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.error(`[debug-server] Running on port ${PORT}`);
});
