import { Player } from 'src/players/interfaces/player.interface';

import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class AddChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  dateTime: Date;

  @IsNotEmpty()
  requester: Player;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: Player[];
}
