import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
  Query,
  Patch,
  Put,
  Param,
} from '@nestjs/common';
import { PlayersService } from 'src/players/players.service';

import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDTO } from './dtos/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidation } from './pipes/challenge-status-vallidation.pipe';

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

  @Put(':challenge')
  async setChallengeStatus(
    @Param('challenge') challenge: string,
    @Body(ChallengeStatusValidation) updateChallengeDTO: UpdateChallengeDTO,
  ) {
    return this.challengeService.update(challenge, updateChallengeDTO);
  }
}
