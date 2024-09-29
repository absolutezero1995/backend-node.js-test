import { PrismaClient } from '@prisma/client';

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

    return events.map(event => ({
      ...event,
      deadline: Math.floor(event.deadline.getTime() / 1000)
    }));
  }
};