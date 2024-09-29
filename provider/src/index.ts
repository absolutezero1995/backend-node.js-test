import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { eventRoutes } from './routes/events';

const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    // Регистрация Swagger
    await fastify.register(swagger, {
      openapi: {
        info: {
          title: 'Provider API',
          description: 'API для сервиса Provider, предоставляющего информацию о событиях для ставок',
          version: '1.0.0',
        },
        servers: [
          {
            url: 'http://localhost:3000',
          },
        ],
        tags: [
          { name: 'events', description: 'События для ставок' }
        ],
      }
    });

    // Регистрация Swagger UI
    await fastify.register(swaggerUi, {
      routePrefix: '/documentation',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false
      },
    });

    // Регистрация CORS
    await fastify.register(cors, {
      origin: "*",
    });

    // Регистрация маршрутов
    await fastify.register(eventRoutes);

    // Запуск сервера
    await fastify.listen({ port: 3000 });
    console.log("Provider service is running on http://localhost:3000");
    console.log("Swagger documentation is available at http://localhost:3000/documentation");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();