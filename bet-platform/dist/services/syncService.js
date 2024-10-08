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
exports.syncEvents = syncEvents;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
function syncEvents(prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${config_1.config.providerUrl}/events`);
            const providerEvents = response.data;
            for (const event of providerEvents) {
                yield prisma.event.upsert({
                    where: { id: event.id },
                    update: {
                        coefficient: event.coefficient,
                        deadline: new Date(event.deadline * 1000),
                        status: event.status,
                    },
                    create: {
                        id: event.id,
                        coefficient: event.coefficient,
                        deadline: new Date(event.deadline * 1000),
                        status: event.status,
                    },
                });
            }
            console.log('Events synced successfully');
        }
        catch (error) {
            console.error('Error syncing events:', error);
        }
    });
}
