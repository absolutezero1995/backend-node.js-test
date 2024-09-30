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
exports.webhookService = void 0;
exports.webhookService = {
    updateEventStatus(prisma, id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield prisma.event.findUnique({
                where: { id }
            });
            if (!event) {
                throw new Error('Event not found');
            }
            yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield tx.event.update({
                    where: { id },
                    data: { status }
                });
                if (status === 'first_team_won') {
                    yield tx.bet.updateMany({
                        where: { eventId: id },
                        data: { status: 'won' }
                    });
                }
                else if (status === 'second_team_won') {
                    yield tx.bet.updateMany({
                        where: { eventId: id },
                        data: { status: 'lost' }
                    });
                }
            }));
        });
    }
};
