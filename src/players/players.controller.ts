import { CreatePlayerDto } from './dtos/create-player.dto';
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
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return await this.playersService.create(createPlayerDto);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    await this.playersService.update(id, updatePlayerDto);
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
