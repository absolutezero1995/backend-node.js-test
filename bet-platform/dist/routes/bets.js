"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.betRoutes = betRoutes;
const typebox_1 = require("@sinclair/typebox");
const betService_1 = require("../services/betService");
function betRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/bets', {
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
                    201: typebox_1.Type.Object({
                        betId: typebox_1.Type.String(),
                        eventId: typebox_1.Type.String(),
                        amount: typebox_1.Type.Number(),
                        potentialWin: typebox_1.Type.Number(),
                        status: typebox_1.Type.String()
                    }),
                    400: typebox_1.Type.Object({
                        message: typebox_1.Type.String()
                    }),
                    500: typebox_1.Type.Object({
                        message: typebox_1.Type.String()
                    })
                }
            }
        }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId, amount } = request.body;
                const bet = yield betService_1.betService.createBet(fastify.prisma, eventId, amount);
                return reply.status(201).send(bet);
            }
            catch (error) {
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
        }));
        fastify.get('/bets', {
            schema: {
                description: 'Возвращает историю всех сделанных ставок',
                tags: ['bets'],
                response: {
                    200: typebox_1.Type.Array(typebox_1.Type.Object({
                        betId: typebox_1.Type.String(),
                        eventId: typebox_1.Type.String(),
                        amount: typebox_1.Type.Number(),
                        potentialWin: typebox_1.Type.Number(),
                        status: typebox_1.Type.String()
                    }))
                }
            }
        }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const bets = yield betService_1.betService.getAllBets(fastify.prisma);
                return reply.send(bets);
            }
            catch (error) {
                fastify.log.error(error);
                return reply.status(500).send({ message: 'Internal Server Error' });
            }
        }));
    });
}
