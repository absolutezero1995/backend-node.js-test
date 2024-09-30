"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRoutes = eventRoutes;
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
let events = [];
const EventSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        coefficient: { type: 'number' },
        deadline: { type: 'integer' },
        status: { type: 'string', enum: ['pending', 'first_team_won', 'second_team_won'] }
    }
};
async function eventRoutes(fastify) {
    fastify.get("/events", {
        schema: {
            description: 'Получить список всех событий',
            tags: ['events'],
            response: {
                200: {
                    description: 'Успешный ответ',
                    type: 'array',
                    items: EventSchema
                }
            }
        }
    }, async (request, reply) => {
        return events;
    });
    fastify.post("/events", {
        schema: {
            description: 'Создать новое событие',
            tags: ['events'],
            body: {
                type: 'object',
                required: ['coefficient', 'deadline'],
                properties: {
                    coefficient: { type: 'number', description: 'Коэффициент ставки' },
                    deadline: { type: 'integer', description: 'Дедлайн события (Unix timestamp)' }
                }
            },
            response: {
                201: {
                    description: 'Событие успешно создано',
                    ...EventSchema
                },
                400: {
                    description: 'Неверные входные данные',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { coefficient, deadline } = request.body;
        if (typeof coefficient !== "number" || coefficient <= 0) {
            return reply.status(400).send({ message: "Invalid coefficient" });
        }
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (typeof deadline !== "number" || deadline <= currentTimestamp) {
            return reply.status(400).send({ message: "Invalid deadline" });
        }
        const newEvent = {
            id: (0, uuid_1.v4)(),
            coefficient,
            deadline,
            status: "pending",
        };
        events.push(newEvent);
        return reply.status(201).send(newEvent);
    });
    fastify.put("/events/:id", {
        schema: {
            description: 'Обновить статус события',
            tags: ['events'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID события' }
                }
            },
            body: {
                type: 'object',
                required: ['status'],
                properties: {
                    status: {
                        type: 'string',
                        enum: ['pending', 'first_team_won', 'second_team_won'],
                        description: 'Новый статус события'
                    }
                }
            },
            response: {
                200: {
                    description: 'Статус события успешно обновлен',
                    ...EventSchema
                },
                400: {
                    description: 'Неверные входные данные',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                404: {
                    description: 'Событие не найдено',
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        const { status } = request.body;
        const eventIndex = events.findIndex(e => e.id === id);
        if (eventIndex === -1) {
            return reply.status(404).send({ message: "Event not found" });
        }
        events[eventIndex].status = status;
        // Уведомление bet-platform об изменении статуса события
        try {
            await axios_1.default.post("http://localhost:4000/webhook/events", {
                id: events[eventIndex].id,
                status: events[eventIndex].status,
            });
        }
        catch (error) {
            fastify.log.error("Failed to notify bet-platform", error);
        }
        return events[eventIndex];
    });
}
