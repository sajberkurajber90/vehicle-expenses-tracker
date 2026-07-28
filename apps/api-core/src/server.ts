import server from './app.ts';
import { transporter } from '@infrastructure/mail/index.ts';

async function start() {
  try {
    await transporter.verify();
    server.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
      if (err) {
        console.warn(err);
        process.exit(1);
      }
      console.info(`server listening on ${address}`);
    });
  } catch (err) {
    console.error(err);
  }
}

start().catch(() => {
  process.exit(1);
});
