import { Injectable, Logger } from '@nestjs/common';
import { SavePlayerDto } from './dtos/save-player.dto';
import { Player } from './interfaces/players.interface';
import { v4 } from 'uuid';

@Injectable()
export class PlayersService {
  #logger = new Logger(PlayersService.name);
  #players: Player[] = [];

  async savePlayer(savePlayerDto: SavePlayerDto): Promise<void> {
    const { email } = savePlayerDto;

    const playerFound = this.#players.find((player) => player.email == email);

    if (playerFound) this.update(playerFound, savePlayerDto);
    else this.save(savePlayerDto);
  }

  async loadAll(): Promise<Player[]> {
    return this.#players;
  }

  private update(playerFound: Player, savePlayerDto: SavePlayerDto): void {
    const { name } = savePlayerDto;
    playerFound.name = name;
  }

  private save(savePlayerDto: SavePlayerDto): void {
    const { name, email, phoneNumber } = savePlayerDto;

    const player: Player = {
      _id: v4(),
      name,
      email,
      phoneNumber,
      ranking: 'A',
      positionRanking: 1,
      urlPhoto: 'https://google.com/foto123.jpg',
    };

    this.#logger.log(`save player: ${JSON.stringify(player)}`);

    this.#players.push(player);
  }
}
