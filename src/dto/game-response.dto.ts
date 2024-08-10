import { GameStatus } from '../entities';
import { GameCellResponseDto } from './game-cell-response.dto';

export class GameResponseDto {
  id: string;
  status: GameStatus;
  rows: number;
  columns: number;
  cells: GameCellResponseDto[];
}
