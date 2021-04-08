import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { RankingsService } from 'src/ranking/rankings.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { SetMatchToChallengeDTO } from './dtos/set-match-to-challenge.dto';
import { UpdateChallengeDTO } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge, Match } from './interfaces/challenge.interface';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('challenges')
    private readonly ChallengeModel: Model<Challenge>,
    @InjectModel('matches')
    private readonly MatchModel: Model<Match>,
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

  async findByPlayer(player: string): Promise<Challenge[]> {
    await this.playersService.loadById(player);

    return await this.ChallengeModel.find()
      .where('players')
      .in([player])
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async findAll(): Promise<Challenge[]> {
    return await this.ChallengeModel.find()
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async update(
    challengeId: string,
    updateChallengeDTO: UpdateChallengeDTO,
  ): Promise<void> {
    const challenge = await this.ChallengeModel.findById(challengeId);

    if (!challenge)
      throw new BadRequestException(`${challengeId} is not a challenge`);

    if (updateChallengeDTO.status) challenge.timestampResponse = new Date();

    challenge.status = updateChallengeDTO.status;
    challenge.dateTime = updateChallengeDTO.dateTime;

    await this.ChallengeModel.findByIdAndUpdate(challengeId, { ...challenge });
  }

  async setMatch(
    challengeId: string,
    setMatchToChallengeDTO: SetMatchToChallengeDTO,
  ) {
    const challenge = await this.ChallengeModel.findById(challengeId);

    if (!challenge)
      throw new BadRequestException(`${challengeId} is not a challenge`);

    const winnerBelongsChallenge = challenge.players.find(
      (player) => player == setMatchToChallengeDTO.winner.id,
    );

    if (!winnerBelongsChallenge)
      throw new BadRequestException('The winner not belongs a challenge');

    const match = new this.MatchModel({
      ...setMatchToChallengeDTO,
      winner: setMatchToChallengeDTO.winner.id,
    });

    match.ranking = challenge.ranking;
    match.players = challenge.players;

    const result = await match.save();

    challenge.status = ChallengeStatus.COMPLETED;
    challenge.match = result._id;

    try {
      await this.ChallengeModel.findByIdAndUpdate(challengeId, {
        ...challenge,
      }).exec();
    } catch (error) {
      await this.ChallengeModel.findByIdAndDelete(challengeId).exec();
      throw new InternalServerErrorException();
    }
  }
}
