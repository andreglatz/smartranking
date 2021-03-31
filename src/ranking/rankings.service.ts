import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRankingDto } from './dtos/create-ranking.dto';
import { UpdateRankingDto } from './dtos/update-ranking.dto';
import { Ranking } from './interfaces/ranking.interface';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel('Ranking') private readonly RankingModel: Model<Ranking>,
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
    return await this.RankingModel.find().exec();
  }

  async loadByRanking(ranking: string): Promise<Ranking> {
    const rankingFound = await this.RankingModel.findOne({ ranking }).exec();

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
}
