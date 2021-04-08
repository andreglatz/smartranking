import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class ChallengeStatusValidation implements PipeTransform {
  private readonly allowedStatus = [
    ChallengeStatus.ACCEPT,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.status) {
      const status = value.status.toUpperCase();

      if (!this.isValidStatus(status))
        throw new BadRequestException(`${status} is a invalid status`);
    }

    return value;
  }

  private isValidStatus(status) {
    const index = this.allowedStatus.indexOf(status);

    return index !== -1;
  }
}
