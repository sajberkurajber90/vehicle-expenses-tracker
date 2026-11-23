import hasPermission, {
  type PermissionMiddleware,
} from '@modules/authorization/hasPermison.ts';
import { SessionMiddleware } from '@modules/auth/session.ts';
import { userService, IUserService } from '@modules/app/user/user.service.ts';
import {
  FastifyInstance,
  HookHandlerDoneFunction,
  RegisterOptions,
} from 'fastify';
import session from '@modules/auth/session.ts';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import {
  type CreateUserSettingsPayload,
  type UpdateUserSettingsPayload,
  createUserSettngsSchema,
  updateUserSettingsSchema,
} from '@modules/app/user/user.schema.ts';
function userRouteFactory(
  session: SessionMiddleware,
  permission: PermissionMiddleware,
  service: IUserService,
  bodySchema: {
    createUserSettngsSchema: z.ZodType<CreateUserSettingsPayload>;
    updateUserSettingsSchema: z.ZodType<UpdateUserSettingsPayload>;
  },
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
      '/:id/settings',
      {
        schema: {
          params: z.object({ id: z.coerce.number().int().positive() }),
        },
        preHandler: permission<{ id: number }>(
          'read',
          'user-settings',
          (request) => request.params.id,
          'users',
        ),
      },
      async (request, reply) => {
        const { id } = request.params;
        const response = await service.findUserSettingsByUserId(id);
        await reply.send(response.ok ? response.value : response.error);
      },
    );

    base.post(
      '/settings',
      {
        schema: {
          body: bodySchema.createUserSettngsSchema,
        },
        preHandler: permission('create', 'user-settings'),
      },
      async (request, reply) => {
        const response = await service.createUserSettings(request.body);
        await reply.send(response.ok ? response.value : response.error);
      },
    );

    base.put(
      '/settings',
      {
        schema: {
          body: bodySchema.updateUserSettingsSchema,
        },
        preHandler: permission<unknown, UpdateUserSettingsPayload>(
          'update',
          'user-settings',
          (request) => request.body.userId,
          'users',
        ),
      },
      async (request, reply) => {
        const response = await service.updateUserSettings(request.body);
      },
    );

    done();
  };
}

export default userRouteFactory(session, hasPermission, userService, {
  createUserSettngsSchema,
  updateUserSettingsSchema,
});
