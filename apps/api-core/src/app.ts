import fastify from 'fastify';
import cors from '@fastify/cors';
const server = fastify();

// routes
import authRoutes from '@modules/auth/auth.routes.ts';
import dashboardRoute from '@modules/dashboard/dashboard.routes.ts';
import authorizationRoute from '@modules/authorization/authorization.routes.ts';

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
    console.log(error);
    if (error instanceof Error) {
      return reply.status(400).send({ error: error.message });
    }

    reply.status(500).send({ error: 'Internal Server Error' });
  });

server.register(authRoutes);
server.register(authorizationRoute, { prefix: '/authorization' });
server.register(dashboardRoute);

export default server;
