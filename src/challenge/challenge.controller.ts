import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { PlayersService } from 'src/players/players.service';

import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';

@Controller('api/v1/challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  private readonly logger = new Logger(ChallengeController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    this.logger.log(`create challenge: ${JSON.stringify(createChallengeDto)}`);
    return this.challengeService.create(createChallengeDto);
  }

  @Get()
  async loadChallenges(@Query('player') player: string): Promise<Challenge[]> {
    return player
      ? await this.challengeService.findByPlayer(player)
      : await this.challengeService.findAll();
  }
}
