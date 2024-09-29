import { FastifyInstance, FastifyError } from 'fastify';
import fp from 'fastify-plugin';

export const errorHandler = fp(async (fastify: FastifyInstance) => {
  fastify.setErrorHandler((error: FastifyError, request, reply) => {
    fastify.log.error(error);

    if (error.validation) {
      reply.status(400).send({
        message: 'Validation error',
        details: error.validation
      });
      return;
    }

    if (error.statusCode) {
      reply.status(error.statusCode).send({ message: error.message });
    } else {
      reply.status(500).send({ message: 'Internal Server Error' });
    }
  });
});