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
import hasPermission, {
  type PermissionMiddleware,
} from '@modules/authorization/hasPermison.ts';
import { querySchema } from '@modules/shared/schema.ts';

function authorizationRouteFactory(
  session: SessionMiddleware,
  permission: PermissionMiddleware,
  service: IAuthorizationService,
) {
  return function (
    instance: FastifyInstance,
    _: RegisterOptions,
    done: HookHandlerDoneFunction,
  ) {
    const base = instance
      .decorateRequest('user', null)
      .withTypeProvider<ZodTypeProvider>()
      .addHook('onRequest', session);

    base.get(
      '/user/:id/roles',
      {
        schema: {
          params: z.object({ id: z.coerce.number().int().positive() }),
        },
        preHandler: permission<{ id: number }>(
          'read',
          'role',
          (request) => request.params.id,
          'users',
        ),
      },
      async (request, reply) => {
        const { id } = request.params;
        const response = await service.findRoleByUserId(id);
        await reply.send(response.ok ? response.value : response.error);
      },
    );

    base.get(
      '/user/:id/permissions',
      {
        schema: {
          querystring: querySchema,
          params: z.object({
            id: z.coerce.number().int().positive(),
          }),
        },
        preHandler: permission<{ id: number }>(
          'read',
          'permission',
          (request) => request.params.id,
          'users',
        ),
      },
      async (request, reply) => {
        const { id } = request.params;
        const p = await service.findPermissionsByUserId(id, request.query);
        await reply.send(
          p.ok
            ? { data: p.value, next: p.nextCursor, prev: p.previousCursor }
            : p.error,
        );
      },
    );

    done();
  };
}

export default authorizationRouteFactory(
  session,
  hasPermission,
  authorizationService,
);
