import fastify from 'fastify';
import cors from '@fastify/cors';
const server = fastify();

// routes
import authRoute from './modules/auth/route.ts';
import dashboardRoute from './modules/dashboard/route.ts';

server.register(cors, {
  origin: [
    `https://${process.env.BASE_URL}`,
    `https://${process.env.UI_MOBILE_PREFIX}.${process.env.BASE_URL}`,
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
});

server.register(authRoute);
server.register(dashboardRoute);

export default server;
