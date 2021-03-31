import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';
import { RankingEvent } from '../interfaces/ranking.interface';

export class UpdateRankingDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: RankingEvent[];
}
