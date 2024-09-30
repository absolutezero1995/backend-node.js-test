import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { eventRoutes } from './routes/events';

const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    await fastify.register(swagger, {
      openapi: {
        info: {
          title: 'Provider API',
          description: 'API для сервиса Provider, предоставляющего информацию о событиях для ставок',
          version: '1.0.0',
        },
        servers: [
          {
            url: 'http://provider:3000',
          },
        ],
        tags: [
          { name: 'events', description: 'События для ставок' }
        ],
      }
    });

    await fastify.register(swaggerUi, {
      routePrefix: '/documentation',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false
      },
    });

    await fastify.register(cors, {
      origin: "*",
    });

    await fastify.register(eventRoutes);

    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log("Provider service is running on http://0.0.0.0:3000");
    console.log("Swagger documentation is available at http://0.0.0.0:3000/documentation");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
