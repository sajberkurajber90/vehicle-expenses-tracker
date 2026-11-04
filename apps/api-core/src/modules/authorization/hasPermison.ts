import {
  type PermissionAction,
  PermissionResource,
} from '@infrastructure/db/types/permissions.ts';
import {
  checkPermissionService,
  CheckPermission,
} from '@modules/authorization/authorization.services.ts';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthUserResponse } from '@modules/auth/auth.schemas.ts';
import { TableExpressionOrList } from 'kysely';
import { type Database } from '@infrastructure/db/types/index.ts';
import { UnauthorizedError } from '@modules/shared/errors.ts';

function hasPermissionFactory(service: CheckPermission) {
  return function hasPermissionHook<Params = unknown>(
    action: PermissionAction,
    resource: PermissionResource,
    getResourceId?: (request: FastifyRequest<{ Params: Params }>) => number,
    table?: TableExpressionOrList<Database, never>,
  ) {
    if (action === 'create') {
      return async (request: FastifyRequest, reply: FastifyReply) => {
        const { id: sessionUserId } =
          request.getDecorator<AuthUserResponse>('user');
        const result = await service(sessionUserId, action, resource);
        if (!result.ok) {
          result instanceof UnauthorizedError
            ? await reply.status(403).send(result.error.message)
            : await reply
                .status(result.error.statusCode)
                .send(result.error.message);
        }
      };
    }

    return async (
      request: FastifyRequest<{ Params: Params }>,
      reply: FastifyReply,
    ) => {
      const { id: sessionUserId } =
        request.getDecorator<AuthUserResponse>('user');
      if (!getResourceId || !table) {
        return reply
          .status(400)
          .send({ error: 'Owner Id Callback or table not Provided' });
      }

      const result = await service(
        sessionUserId,
        action,
        resource,
        getResourceId(request),
        table,
      );
      if (!result.ok) {
        result instanceof UnauthorizedError
          ? await reply.status(403).send(result.error.message)
          : await reply
              .status(result.error.statusCode)
              .send(result.error.message);
      }
    };
  };
}

export default hasPermissionFactory(checkPermissionService);
export type PermissionMiddleware = ReturnType<typeof hasPermissionFactory>;
