import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { CellStatus } from '../entities';

export class UpdateGameCellDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsEnum(CellStatus)
  status?: CellStatus;
}
