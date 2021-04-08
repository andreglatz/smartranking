import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from 'src/players/players.module';
import { RankingsModule } from 'src/ranking/rankings.module';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { ChallengeSchmea } from './interfaces/challenge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'challenges', schema: ChallengeSchmea },
    ]),
    PlayersModule,
    RankingsModule,
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
