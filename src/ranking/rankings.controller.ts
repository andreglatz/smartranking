import { CreateRankingDto } from './dtos/create-ranking.dto';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Ranking } from './interfaces/ranking.interface';
import { RankingsService } from './rankings.service';
import { UpdateRankingDto } from './dtos/update-ranking.dto';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createRanking(
    @Body() createRankingDto: CreateRankingDto,
  ): Promise<Ranking> {
    return await this.rankingsService.create(createRankingDto);
  }

  @Get()
  async loadRankings(): Promise<Ranking[]> {
    return await this.rankingsService.loadAll();
  }

  @Get('/:ranking')
  async loadByRanking(@Param('ranking') ranking: string): Promise<Ranking> {
    return await this.rankingsService.loadByRanking(ranking);
  }

  @Put('/:ranking')
  async updateRanking(
    @Param('ranking') ranking: string,
    @Body() updateRankingDto: UpdateRankingDto,
  ): Promise<void> {
    await this.rankingsService.update(ranking, updateRankingDto);
  }
}
