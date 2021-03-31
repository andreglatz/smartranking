import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';

export interface Ranking extends Document {
  readonly ranking: string;
  description: string;
  events: RankingEvent[];
  players: Player[];
}

export interface RankingEvent {
  name: string;
  operation: string;
  value: number;
}
