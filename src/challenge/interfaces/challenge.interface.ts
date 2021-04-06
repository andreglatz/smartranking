import { Document } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from './challenge-status.enum';

export interface Challenge extends Document {
  dateTime: Date;
  status: ChallengeStatus;
  timestampRequest: Date;
  timestampResponse: Date;
  requester: Player;
  ranking: string;
  players: Player[];
  match: Match;
}

export interface Match extends Document {
  ranking: string;
  players: Player[];
  winner: Player;
  result: Result[];
}

export interface Result {
  set: string;
}
