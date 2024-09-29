export type EventStatus = 'pending' | 'first_team_won' | 'second_team_won';

export interface Event {
  id: string;
  coefficient: number;
  deadline: number;
  status: EventStatus;
}
