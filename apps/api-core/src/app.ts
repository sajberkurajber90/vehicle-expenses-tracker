import fastify from 'fastify';
import cors from '@fastify/cors';
const server = fastify();

// routes
import dashboardRoute from './modules/dashboard/route.ts';

server.register(cors, {
  origin: [
    `https://${process.env.BASE_URL}`,
    `https://${process.env.UI_MOBILE_PREFIX}.${process.env.BASE_URL}`,
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
});

server.register(dashboardRoute);

export default server;
