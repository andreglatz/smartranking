import { Body, Controller, Post } from '@nestjs/common';
import { SavePlayerDto } from './dtos/save-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async savePlayer(@Body() savePlayerDto: SavePlayerDto) {
    await this.playersService.savePlayer(savePlayerDto);
  }
}
