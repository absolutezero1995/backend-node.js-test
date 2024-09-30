import { PrismaClient, Prisma } from '@prisma/client';

export const webhookService = {
  async updateEventStatus(prisma: PrismaClient, id: string, status: string) {
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.event.update({
        where: { id },
        data: { status }
      });

      if (status === 'first_team_won') {
        await tx.bet.updateMany({
          where: { eventId: id },
          data: { status: 'won' }
        });
      } else if (status === 'second_team_won') {
        await tx.bet.updateMany({
          where: { eventId: id },
          data: { status: 'lost' }
        });
      }
    });
  }
};