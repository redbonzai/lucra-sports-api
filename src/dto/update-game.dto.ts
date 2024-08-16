import { IsEnum, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { GameStatus } from '../entities';
import { Type } from 'class-transformer';
import { UpdateGameCellDto } from './update-game-cell.dto';

export class UpdateGameDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsEnum(GameStatus)
  status?: GameStatus;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateGameCellDto)
  cells?: UpdateGameCellDto[];
}
