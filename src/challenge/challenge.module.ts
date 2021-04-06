import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { ChallengeSchmea } from './interfaces/challenge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'challengers', schema: ChallengeSchmea },
    ]),
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
