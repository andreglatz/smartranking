import { Body, Controller, Get, Post } from '@nestjs/common';
import { SavePlayerDto } from './dtos/save-player.dto';
import { Player } from './interfaces/players.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async savePlayer(@Body() savePlayerDto: SavePlayerDto) {
    await this.playersService.savePlayer(savePlayerDto);
  }

  @Get()
  async loadPlayers(): Promise<Player[]> {
    return this.playersService.loadAll();
  }
}
