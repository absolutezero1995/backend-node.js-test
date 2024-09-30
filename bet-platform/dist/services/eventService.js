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
exports.eventService = void 0;
exports.eventService = {
    getAvailableEvents(prisma) {
        return __awaiter(this, void 0, void 0, function* () {
            const events = yield prisma.event.findMany({
                where: {
                    deadline: {
                        gt: new Date()
                    }
                },
                select: {
                    id: true,
                    coefficient: true,
                    deadline: true
                }
            });
            return events.map((event) => ({
                id: event.id,
                coefficient: event.coefficient,
                deadline: Math.floor(event.deadline.getTime() / 1000)
            }));
        });
    }
};
