import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { RankingEvent } from '../interfaces/ranking.interface';

export class CreateRankingDto {
  @IsString()
  @IsNotEmpty()
  readonly ranking: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: RankingEvent[];
}
