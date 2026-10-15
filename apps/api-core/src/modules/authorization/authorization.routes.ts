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
import z from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
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
      .withTypeProvider<ZodTypeProvider>()
      .addHook('onRequest', session)
      .get(
        '/user/:id',
        {
          schema: {
            params: z.object({ id: z.coerce.number().int().positive() }),
          },
        },
        async (request, reply) => {
          const { id } = request.params;
          await reply.send({ hello: `test ${id}` });
        },
      );

    done();
  };
}

export default authorizationRouteFactory(session, authorizationService);
