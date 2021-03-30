import { SavePlayerDto } from './dtos/save-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() savePlayerDto: SavePlayerDto): Promise<Player> {
    return await this.playersService.create(savePlayerDto);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Param('id') id: string,
    @Body() savePlayerDto: SavePlayerDto,
  ) {
    await this.playersService.update(id, savePlayerDto);
  }

  @Get()
  async loadPlayers(): Promise<Player[]> {
    return await this.playersService.loadAll();
  }

  @Get('/:id')
  async loadPlayerById(@Param('id') id: string): Promise<Player> {
    return await this.playersService.loadById(id);
  }

  @Delete('/:id')
  async deletePlayer(@Param('id') id: string): Promise<void> {
    await this.playersService.delete(id);
  }
}
