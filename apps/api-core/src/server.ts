import { createServer } from 'node:http';
async function start() {
  createServer(async (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!\n');
  }).listen(3000, '127.0.0.1', () => {
    console.warn('server started');
  });
}

start().catch(() => {
  process.exit(1);
});
