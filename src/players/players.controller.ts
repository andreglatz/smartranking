import { SavePlayerDto } from './dtos/save-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PlayersParamsValidationPipe } from './pipes/players-params-validation.pipe';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async savePlayer(@Body() savePlayerDto: SavePlayerDto) {
    await this.playersService.savePlayer(savePlayerDto);
  }

  @Get()
  async loadPlayers(@Query('email') email: string): Promise<Player[] | Player> {
    if (email) return await this.playersService.findByEmail(email);
    else return await this.playersService.loadAll();
  }

  @Delete()
  async deletePlayer(
    @Query('email', PlayersParamsValidationPipe) email: string,
  ): Promise<void> {
    await this.playersService.delete(email);
  }
}
