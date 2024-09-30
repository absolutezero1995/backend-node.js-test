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
exports.betService = void 0;
exports.betService = {
    createBet(prisma, eventId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield prisma.event.findUnique({
                where: { id: eventId }
            });
            if (!event) {
                throw new Error('Event not found');
            }
            if (event.deadline < new Date()) {
                throw new Error('Event deadline has passed');
            }
            if (amount <= 0 || !Number.isInteger(amount * 100)) {
                throw new Error('Invalid amount');
            }
            const bet = yield prisma.bet.create({
                data: {
                    eventId,
                    amount,
                    potentialWin: Number((amount * event.coefficient).toFixed(2)),
                    status: 'pending'
                }
            });
            return {
                betId: bet.id,
                eventId: bet.eventId,
                amount: bet.amount,
                potentialWin: bet.potentialWin,
                status: bet.status
            };
        });
    },
    getAllBets(prisma) {
        return __awaiter(this, void 0, void 0, function* () {
            const bets = yield prisma.bet.findMany({
                select: {
                    id: true,
                    eventId: true,
                    amount: true,
                    potentialWin: true,
                    status: true
                }
            });
            return bets.map((bet) => ({
                betId: bet.id,
                eventId: bet.eventId,
                amount: bet.amount,
                potentialWin: bet.potentialWin,
                status: bet.status
            }));
        });
    },
};
