import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRankingDto } from './dtos/create-ranking.dto';
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
}
