import type { SessionMiddleware } from '@modules/auth/session.ts';
import type {
  FastifyInstance,
  HookHandlerDoneFunction,
  RegisterOptions,
} from 'fastify';
import {
  authorizationService,
  IAuthorizationService,
} from '@modules/authorization/authorization.services.ts';
import session from '@modules/auth/session.ts';

function authorizationRouteFactory(
  session: SessionMiddleware,
  service: IAuthorizationService,
) {
  return function (
    instance: FastifyInstance,
    _: RegisterOptions,
    done: HookHandlerDoneFunction,
  ) {
    instance
      .addHook('onRequest', session)
      .get('/user/:id', async (request, reply) => {
        await reply.send({ hello: 'kurac' });
      });

    done();
  };
}

export default authorizationRouteFactory(session, authorizationService);
