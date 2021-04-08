import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export type UpdateChallengeDTO = {
  dateTime: Date;
  status: ChallengeStatus;
};
