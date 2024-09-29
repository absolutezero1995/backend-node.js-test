import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';

interface ProviderEvent {
  id: string;
  coefficient: number;
  deadline: number;
  status: string;
}

export async function syncEvents(prisma: PrismaClient) {
  try {
    const response = await axios.get<ProviderEvent[]>(`${config.providerUrl}/events`);
    const providerEvents = response.data;

    for (const event of providerEvents) {
      await prisma.event.upsert({
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
  } catch (error) {
    console.error('Error syncing events:', error);
  }
}