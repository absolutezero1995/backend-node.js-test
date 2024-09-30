"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const events_1 = require("./routes/events");
const fastify = (0, fastify_1.default)({ logger: true });
const start = async () => {
    try {
        // Регистрация Swagger
        await fastify.register(swagger_1.default, {
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
        await fastify.register(swagger_ui_1.default, {
            routePrefix: '/documentation',
            uiConfig: {
                docExpansion: 'full',
                deepLinking: false
            },
        });
        // Регистрация CORS
        await fastify.register(cors_1.default, {
            origin: "*",
        });
        // Регистрация маршрутов
        await fastify.register(events_1.eventRoutes);
        // Запуск сервера
        await fastify.listen({ port: 3000 });
        console.log("Provider service is running on http://localhost:3000");
        console.log("Swagger documentation is available at http://localhost:3000/documentation");
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
