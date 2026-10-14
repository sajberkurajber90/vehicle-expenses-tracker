import type {
  FastifyInstance,
  RegisterOptions,
  HookHandlerDoneFunction,
} from 'fastify';

import session, { type SessionMiddleware } from '@modules/auth/session.ts';

// TODO add services and repositories to the dashboard authRoutes

function dashboardRoutedFactory(session: SessionMiddleware) {
  return function (
    instance: FastifyInstance,
    _: RegisterOptions,
    done: HookHandlerDoneFunction,
  ) {
    instance.addHook('onRequest', session).get('/', async (request, reply) => {
      await reply.send({ hello: 'dash' });
    });

    done();
  };
}

export default dashboardRoutedFactory(session);
