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
exports.webhookRoutes = webhookRoutes;
const typebox_1 = require("@sinclair/typebox");
const webhookService_1 = require("../services/webhookService");
function webhookRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/webhook/events', {
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
                    200: typebox_1.Type.Object({
                        message: typebox_1.Type.String()
                    }),
                    400: typebox_1.Type.Object({
                        message: typebox_1.Type.String()
                    }),
                    404: typebox_1.Type.Object({
                        message: typebox_1.Type.String()
                    })
                }
            }
        }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id, status } = request.body;
            try {
                const result = yield webhookService_1.webhookService.updateEventStatus(fastify.prisma, id, status);
                return reply.status(200).send(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    fastify.log.error(error);
                    if (error.message.includes('not found')) {
                        return reply.status(404).send({ message: error.message });
                    }
                    return reply.status(400).send({ message: error.message });
                }
                throw error;
            }
        }));
    });
}
