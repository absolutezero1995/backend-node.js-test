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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const client_1 = require("@prisma/client");
const events_1 = require("./routes/events");
const bets_1 = require("./routes/bets");
const webhook_1 = require("./routes/webhook");
const errorHandler_1 = require("./plugins/errorHandler");
const config_1 = require("./config");
const syncService_1 = require("./services/syncService");
const prisma = new client_1.PrismaClient();
const buildFastify = () => {
    const fastify = (0, fastify_1.default)({ logger: true });
    fastify.decorate('prisma', prisma);
    fastify.register(errorHandler_1.errorHandler);
    fastify.register(swagger_1.default, {
        openapi: {
            info: {
                title: 'Bet Platform API',
                description: 'API для bet-platform, принимающей ставки на события',
                version: '1.0.0',
            },
            servers: [
                {
                    url: config_1.config.baseUrl,
                },
            ],
            tags: [
                { name: 'events', description: 'События для ставок' },
                { name: 'bets', description: 'Ставки' },
                { name: 'webhook', description: 'Обработка внешних событий' },
            ],
        },
    });
    fastify.register(swagger_ui_1.default);
    fastify.register(cors_1.default, {
        origin: config_1.config.corsOrigin,
    });
    fastify.register(events_1.eventRoutes);
    fastify.register(bets_1.betRoutes);
    fastify.register(webhook_1.webhookRoutes);
    return fastify;
};
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const fastify = buildFastify();
    try {
        // Запускаем первичную синхронизацию
        yield (0, syncService_1.syncEvents)(prisma);
        // Запускаем периодическую синхронизацию каждые 1 минут
        setInterval(() => (0, syncService_1.syncEvents)(prisma), 1 * 60 * 1000);
        yield fastify.listen({ port: config_1.config.port, host: config_1.config.host });
        console.log(`Bet-platform service is running on ${config_1.config.baseUrl}`);
        console.log(`Swagger documentation is available at ${config_1.config.baseUrl}/documentation`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
start();
