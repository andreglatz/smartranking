import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { SavePlayerDto } from './dtos/save-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async savePlayer(@Body() savePlayerDto: SavePlayerDto) {
    await this.playersService.savePlayer(savePlayerDto);
  }

  @Get()
  async loadPlayers(@Query('email') email: string): Promise<Player[] | Player> {
    if (email) return await this.playersService.findByEmail(email);
    else return await this.playersService.loadAll();
  }

  @Delete()
  async deletePlayer(@Query('email') email: string): Promise<void> {
    await this.playersService.delete(email);
  }
}
