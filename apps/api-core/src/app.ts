import fastify from 'fastify';
import cors from '@fastify/cors';
// routes
import authRoutes from '@modules/auth/auth.routes.ts';
import dashboardRoute from '@modules/dashboard/dashboard.routes.ts';
import authorizationRoute from '@modules/authorization/authorization.routes.ts';
import userRoute from '@modules/app/user/user.routes.ts';
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

const server = fastify();
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server
  .register(cors, {
    origin: [
      `https://${process.env.BASE_URL}`,
      `https://${process.env.UI_MOBILE_PREFIX}.${process.env.BASE_URL}`,
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
  })
  .setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.code(400).send({
        error: 'Invalid request data',
        message: 'Request does not match the expected schema',
        details: error.validation,
      });
    }

    if (error instanceof Error) {
      return reply.status(500).send({ error: error.message });
    }

    reply.status(500).send({ error: 'Internal Server Error' });
  });

server.register(authRoutes);
server.register(authorizationRoute, { prefix: '/authorization' });
server.register(dashboardRoute);
server.register(userRoute, { prefix: '/user' });

export default server;
