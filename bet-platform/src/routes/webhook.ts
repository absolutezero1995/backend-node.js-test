import { FastifyInstance } from "fastify";
import { Type } from '@sinclair/typebox';
import { webhookService } from '../services/webhookService';

export async function webhookRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: { id: string; status: string } }>('/webhook/events', {
    schema: {
      description: 'Обработка обновлений статуса событий',
      tags: ['webhook'],
      body: {
        type: 'object',
        required: ['id', 'status'],
        properties: {
          id: { type: 'string', minLength: 1 },
          status: { type: 'string', enum: ['first_team_won', 'second_team_won', 'draw'] }
        }
      },
      response: {
        200: Type.Object({
          message: Type.String()
        }),
        400: Type.Object({
          message: Type.String()
        }),
        404: Type.Object({
          message: Type.String()
        })
      }
    }
  }, async (request, reply) => {
    const { id, status } = request.body;

    try {
      const result = await webhookService.updateEventStatus(fastify.prisma, id, status);
      return reply.status(200).send(result);
    } catch (error) {
      if (error instanceof Error) {
        fastify.log.error(error);
        if (error.message.includes('not found')) {
          return reply.status(404).send({ message: error.message });
        }
        return reply.status(400).send({ message: error.message });
      }
      throw error;
    }
  });
}