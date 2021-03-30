import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';

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

  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    const playerFound = await this.playerModule.findById(id).exec();

    if (!playerFound)
      throw new NotFoundException(`Player with id ${id} not found`);

    const { name, phoneNumber } = updatePlayerDto;

    return await this.playerModule
      .findByIdAndUpdate(id, { $set: { name, phoneNumber } })
      .exec();
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;
    const foundPlayer = await this.playerModule.findOne({ email }).exec();

    if (foundPlayer)
      throw new BadRequestException(
        `Player with email ${email} already registered`,
      );

    const player = new this.playerModule(createPlayerDto);
    return await player.save();
  }
}
