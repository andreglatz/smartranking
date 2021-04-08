import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { RankingsService } from 'src/ranking/rankings.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('challenges')
    private readonly ChallengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
    private readonly rankingsService: RankingsService,
  ) {}

  private readonly logger = new Logger(ChallengeService.name);

  async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    const players = await this.playersService.loadAll();

    createChallengeDto.players.filter((playerDTO) => {
      const playerFilter = players.filter(
        (player) => player.id == playerDTO.id,
      );

      if (playerFilter.length == 0)
        throw new BadRequestException(`The id ${playerDTO.id} is not a player`);
    });

    const requester = createChallengeDto.players.filter(
      (player) => player.id === createChallengeDto.requester.id,
    )[0];

    this.logger.log(`requesterIsAMatchPlayer: ${JSON.stringify(requester)}`);

    if (!requester)
      throw new BadRequestException('The requester must be a player match');

    const playerRanking = await this.rankingsService.findByPlayer(
      createChallengeDto.requester.id,
    );

    if (!playerRanking)
      throw new BadRequestException('The requester must be belongs a ranking');

    const createdChallenge = new this.ChallengeModel({
      ...createChallengeDto,
      players: createChallengeDto.players.map((player) => player.id),
      requester: createChallengeDto.requester.id,
    });

    createdChallenge.ranking = requester.ranking;
    createdChallenge.dateTime = new Date();
    createdChallenge.status = ChallengeStatus.PENDING;

    this.logger.log(`challenge created: ${JSON.stringify(createdChallenge)}`);
    return await createdChallenge.save();
  }
}
