import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SavePlayerDto } from './dtos/save-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('player') private readonly playerModule: Model<Player>,
  ) {}

  async loadAll(): Promise<Player[]> {
    return await this.playerModule.find().exec();
  }

  async loadById(id: string): Promise<Player> {
    const playerFound = await this.playerModule.findById(id).exec();

    if (!playerFound)
      throw new NotFoundException(`Player with id ${id} not found`);

    return playerFound;
  }

  async delete(id: string): Promise<any> {
    return await this.playerModule.findByIdAndDelete(id).exec();
  }

  async update(id: string, savePlayerDto: SavePlayerDto): Promise<Player> {
    const playerFound = await this.playerModule.findById(id).exec();

    if (!playerFound)
      throw new NotFoundException(`Player with id ${id} not found`);

    return await this.playerModule
      .findByIdAndUpdate(id, { $set: savePlayerDto })
      .exec();
  }

  async create(savePlayerDto: SavePlayerDto): Promise<Player> {
    const { email } = savePlayerDto;
    const foundPlayer = await this.playerModule.findOne({ email }).exec();

    if (foundPlayer)
      throw new BadRequestException(
        `Player with email ${email} already registered`,
      );

    const player = new this.playerModule(savePlayerDto);
    return await player.save();
  }
}
