import type {
  FastifyInstance,
  RegisterOptions,
  HookHandlerDoneFunction,
} from 'fastify';

function route(
  instance: FastifyInstance,
  _: RegisterOptions,
  done: HookHandlerDoneFunction,
) {
  instance.get('/', async (request, reply) => {
    await reply.send({ hello: 'dash' });
  });

  done();
}

export default route;
