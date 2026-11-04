import auth, { type BetterAuthClient } from '@modules/auth/config.ts';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { fromNodeHeaders } from 'better-auth/node';
import z from 'zod';
import {
  type SessionResponse,
  type AuthUserResponse,
  sessionResponseSchema,
} from '@modules/auth/auth.schemas.ts';
import { ValidationError } from '@modules/shared/errors.ts';

function sessionFactory(
  auth: BetterAuthClient,
  validator: z.ZodType<SessionResponse>,
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.headers.cookie) {
      return await reply.status(401).send({ error: 'Unauthorized' });
    }

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      return await reply.status(401).send({ error: 'Unauthorized' });
    }

    const validation = validator.safeParse(session);
    if (!validation.success) {
      return await reply.status(400).send({
        error: new ValidationError('failed to parse session', 'session - hook'),
      });
    }
    request.setDecorator<AuthUserResponse>('user', validation.data.user);
  };
}
export type SessionMiddleware = ReturnType<typeof sessionFactory>;
export default sessionFactory(auth, sessionResponseSchema);
