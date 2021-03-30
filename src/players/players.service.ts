import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async findByEmail(email: string): Promise<Player> {
    const playerFound = this.#players.find((player) => player.email == email);

    if (!playerFound)
      throw new NotFoundException(`Player with email ${email} not found`);

    return playerFound;
  }

  async delete(email: string): Promise<void> {
    const playerFound = this.#players.find((player) => player.email === email);

    if (!playerFound)
      throw new NotFoundException(`Player with email ${email} not found`);

    this.#players = this.#players.filter(
      (player) => player.email !== playerFound.email,
    );
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
