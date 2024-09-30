import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';  
import { PrismaClient } from '@prisma/client';
import { eventRoutes } from './routes/events';
import { betRoutes } from './routes/bets';
import { webhookRoutes } from './routes/webhook';
import { errorHandler } from './plugins/errorHandler';
import { config } from './config';
import { syncEvents } from './services/syncService';

const prisma = new PrismaClient();

const buildFastify = (): FastifyInstance => {
  const fastify = Fastify({ logger: true });

  fastify.decorate('prisma', prisma);

  fastify.register(errorHandler);
  fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Bet Platform API',
        description: 'API для bet-platform, принимающей ставки на события',
        version: '1.0.0',
      },
      servers: [
        {
          url: config.baseUrl,
        },
      ],
      tags: [
        { name: 'events', description: 'События для ставок' },
        { name: 'bets', description: 'Ставки' },
        { name: 'webhook', description: 'Обработка внешних событий' },
      ],
    },
  });
  fastify.register(swaggerUi);
  fastify.register(cors, {
    origin: config.corsOrigin,
  });
  fastify.register(eventRoutes);
  fastify.register(betRoutes);
  fastify.register(webhookRoutes);

  return fastify;
};

const start = async () => {
  const fastify = buildFastify();

  try {
    // Запускаем первичную синхронизацию
    await syncEvents(prisma);

    // Запускаем периодическую синхронизацию каждые 6 секунд
    setInterval(() => syncEvents(prisma), 0.1 * 60 * 1000);

    await fastify.listen({ port: config.port, host: config.host });
    console.log(`Bet-platform service is running on ${config.baseUrl}`);
    console.log(
      `Swagger documentation is available at ${config.baseUrl}/documentation`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();