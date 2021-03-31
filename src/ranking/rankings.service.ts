import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateRankingDto } from './dtos/create-ranking.dto';
import { UpdateRankingDto } from './dtos/update-ranking.dto';
import { Ranking } from './interfaces/ranking.interface';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel('rankings') private readonly RankingModel: Model<Ranking>,
    private readonly playersService: PlayersService,
  ) {}

  async create(createRankingDto: CreateRankingDto): Promise<Ranking> {
    const { ranking } = createRankingDto;

    const rankingFound = await this.RankingModel.findOne({ ranking }).exec();

    if (rankingFound)
      throw new BadRequestException(`Ranking ${ranking} already registered`);

    const createdRanking = new this.RankingModel(createRankingDto);

    return await createdRanking.save();
  }

  async loadAll(): Promise<Ranking[]> {
    return await this.RankingModel.find().populate('players').exec();
  }

  async loadByRanking(ranking: string): Promise<Ranking> {
    const rankingFound = await this.RankingModel.findOne({ ranking })
      .populate('players')
      .exec();

    if (!rankingFound)
      throw new NotFoundException(`Ranking ${ranking} not found`);

    return rankingFound;
  }

  async update(
    ranking: string,
    updateRankingDto: UpdateRankingDto,
  ): Promise<void> {
    const rankingFound = await this.RankingModel.findOne({ ranking }).exec();

    if (!rankingFound)
      throw new NotFoundException(`Ranking ${ranking} not found`);

    await this.RankingModel.findOneAndUpdate(
      { ranking },
      { $set: updateRankingDto },
    ).exec();
  }

  async link(ranking: string, player: string): Promise<void> {
    const rankingFound = await this.RankingModel.findOne({ ranking }).exec();
    const playerAlreadyLinkedRanking = await this.RankingModel.find({ ranking })
      .where('players')
      .in([player]);

    await this.playersService.loadById(player);

    if (!rankingFound)
      throw new NotFoundException(`Ranking ${ranking} not found`);

    if (playerAlreadyLinkedRanking.length)
      throw new BadRequestException(`Player already linked to the ranking`);

    const players = rankingFound.players.map((player) => player.id);
    players.push(player);

    await this.RankingModel.findOneAndUpdate(
      { ranking },
      { $set: { players } },
    );
  }
}
