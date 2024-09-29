import { PrismaClient } from '@prisma/client';

export const webhookService = {
  async updateEventStatus(prisma: PrismaClient, id: string, status: string) {
    return await prisma.$transaction(async (tx) => {
      // Сначала проверяем, существует ли событие
      const event = await tx.event.findUnique({
        where: { id }
      });

      if (!event) {
        throw new Error(`Event with id ${id} not found`);
      }

      // Если событие существует, обновляем его статус
      await tx.event.update({
        where: { id },
        data: { status }
      });

      // Обновляем статусы ставок
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

      return { message: 'Event status updated successfully' };
    });
  }
};