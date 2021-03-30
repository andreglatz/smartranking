import { Injectable, NotFoundException } from '@nestjs/common';
import { SavePlayerDto } from './dtos/save-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('player') private readonly playerModule: Model<Player>,
  ) {}

  async savePlayer(savePlayerDto: SavePlayerDto): Promise<void> {
    const { email } = savePlayerDto;

    const playerFound = await this.playerModule.findOne({ email }).exec();

    if (playerFound) this.update(playerFound, savePlayerDto);
    else this.save(savePlayerDto);
  }

  async loadAll(): Promise<Player[]> {
    return await this.playerModule.find().exec();
  }

  async findByEmail(email: string): Promise<Player> {
    const playerFound = await this.playerModule.findOne({ email }).exec();

    if (!playerFound)
      throw new NotFoundException(`Player with email ${email} not found`);

    return playerFound;
  }

  async delete(email: string): Promise<any> {
    return await this.playerModule.deleteOne({ email }).exec();
  }

  private async update(
    player: Player,
    savePlayerDto: SavePlayerDto,
  ): Promise<Player> {
    return await this.playerModule
      .findOneAndUpdate({ email: player.email }, { $set: savePlayerDto })
      .exec();
  }

  private async save(savePlayerDto: SavePlayerDto): Promise<Player> {
    const player = new this.playerModule(savePlayerDto);
    return await player.save();
  }
}
