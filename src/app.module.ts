import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { RankingsModule } from './ranking/rankings.module';
import { ChallengeModule } from './challenge/challenge.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:JZJTpMhm8JqAFd54@cluster0.0zbf6.mongodb.net/smartranking',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    PlayersModule,
    RankingsModule,
    ChallengeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
