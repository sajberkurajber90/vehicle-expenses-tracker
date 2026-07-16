import { createServer } from 'node:http';
async function start() {
  createServer(async (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!\n test 1233 \n');
  }).listen(3000, '0.0.0.0', () => {
    console.warn('server started yes');
  });
}

start().catch(() => {
  process.exit(1);
});
