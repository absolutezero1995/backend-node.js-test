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
exports.eventRoutes = eventRoutes;
const typebox_1 = require("@sinclair/typebox");
const eventService_1 = require("../services/eventService");
function eventRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get('/events', {
            schema: {
                description: 'Получить список доступных событий',
                tags: ['events'],
                response: {
                    200: typebox_1.Type.Array(typebox_1.Type.Object({
                        id: typebox_1.Type.String(),
                        coefficient: typebox_1.Type.Number(),
                        deadline: typebox_1.Type.Integer()
                    }))
                }
            }
        }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const events = yield eventService_1.eventService.getAvailableEvents(fastify.prisma);
            return events;
        }));
    });
}
