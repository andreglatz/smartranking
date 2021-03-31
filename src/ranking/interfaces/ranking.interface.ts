import { Document } from 'mongoose';

export interface Ranking extends Document {
  readonly ranking: string;
  description: string;
  events: RankingEvent[];
}

export interface RankingEvent {
  name: string;
  operation: string;
  value: number;
}
