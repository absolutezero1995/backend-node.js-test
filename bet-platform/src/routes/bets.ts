import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Type } from '@sinclair/typebox';
import { betService } from '../services/betService';

export async function betRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: { eventId: string; amount: number } }>('/bets', {
    schema: {
      description: 'Совершает ставку на событие',
      tags: ['bets'],
      body: {
        type: 'object',
        required: ['eventId', 'amount'],
        properties: {
          eventId: { type: 'string', minLength: 1 },
          amount: { type: 'number', minimum: 0.01, multipleOf: 0.01 }
        }
      },
      response: {
        201: Type.Object({
          betId: Type.String(),
          eventId: Type.String(),
          amount: Type.Number(),
          potentialWin: Type.Number(),
          status: Type.String()
        }),
        400: Type.Object({
          message: Type.String()
        }),
        500: Type.Object({
          message: Type.String()
        })
      }
    }
  }, async (request: FastifyRequest<{ Body: { eventId: string; amount: number } }>, reply: FastifyReply) => {
    try {
      const { eventId, amount } = request.body;
      const bet = await betService.createBet(fastify.prisma, eventId, amount);
      return reply.status(201).send(bet);
    } catch (error) {
      fastify.log.error(error);
      if (error instanceof Error) {
        if (error.message === 'Event not found' || error.message === 'Event deadline has passed') {
          return reply.status(400).send({ message: error.message });
        }
        if (error.message === 'Invalid amount') {
          return reply.status(400).send({ message: 'Amount must be a positive number with up to two decimal places' });
        }
      }
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  fastify.get('/bets', {
    schema: {
      description: 'Возвращает историю всех сделанных ставок',
      tags: ['bets'],
      response: {
        200: Type.Array(Type.Object({
          betId: Type.String(),
          eventId: Type.String(),
          amount: Type.Number(),
          potentialWin: Type.Number(),
          status: Type.String()
        }))
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const bets = await betService.getAllBets(fastify.prisma);
      return reply.send(bets);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });
}