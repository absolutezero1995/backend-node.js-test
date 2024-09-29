import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Type } from '@sinclair/typebox';
import { eventService } from '../services/eventService';

export async function eventRoutes(fastify: FastifyInstance) {
  fastify.get('/events', {
    schema: {
      description: 'Получить список доступных событий',
      tags: ['events'],
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          coefficient: Type.Number(),
          deadline: Type.Integer()
        }))
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const events = await eventService.getAvailableEvents(fastify.prisma);
    return events;
  });
}