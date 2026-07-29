import type {
  FastifyInstance,
  RegisterOptions,
  HookHandlerDoneFunction,
} from 'fastify';

import auth from '@infrastructure/auth/index.ts';

import { fromNodeHeaders } from 'better-auth/node';

function route(
  instance: FastifyInstance,
  _: RegisterOptions,
  done: HookHandlerDoneFunction,
) {
  instance.route({
    method: ['GET', 'POST', 'OPTIONS'],
    url: '/api/auth/*',
    async handler(request, reply) {
      try {
        // Construct request URL
        const url = new URL(request.url, `https://${request.headers.host}`);

        // Convert Fastify headers to standard Headers object
        const headers = fromNodeHeaders(request.headers);
        // Create Fetch API-compatible request
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          ...(request.body ? { body: JSON.stringify(request.body) } : {}),
        });
        // Process authentication request
        const response = await auth.handler(req);
        // Forward response to client
        await reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        return reply.send(response.body ? await response.text() : null);
      } catch (error) {
        return reply.status(500).send({
          error: 'Internal authentication error',
          code: 'AUTH_FAILURE',
        });
      }
    },
  });

  done();
}

export default route;
