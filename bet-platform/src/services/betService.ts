import { PrismaClient } from '@prisma/client';

export const betService = {
  async createBet(prisma: PrismaClient, eventId: string, amount: number) {
    const event = await prisma.event.findUnique({
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

    const bet = await prisma.bet.create({
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
  },

  async getAllBets(prisma: PrismaClient) {
    const bets = await prisma.bet.findMany({
      select: {
        id: true,
        eventId: true,
        amount: true,
        potentialWin: true,
        status: true
      }
    });

    return bets.map(bet => ({
      betId: bet.id,
      eventId: bet.eventId,
      amount: bet.amount,
      potentialWin: bet.potentialWin,
      status: bet.status
    }));
  },
};