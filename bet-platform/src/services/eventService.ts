import { PrismaClient } from '@prisma/client';

interface SelectedEvent {
  id: string;
  coefficient: number;
  deadline: Date;
}

export const eventService = {
  async getAvailableEvents(prisma: PrismaClient) {
    const events = await prisma.event.findMany({
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

    return events.map((event: SelectedEvent) => ({
      id: event.id,
      coefficient: event.coefficient,
      deadline: Math.floor(event.deadline.getTime() / 1000)
    }));
  }
};