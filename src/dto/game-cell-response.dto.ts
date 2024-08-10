import { CellStatus } from '../entities';

export class GameCellResponseDto {
  id: string;
  xCoordinate: number;
  yCoordinate: number;
  status: CellStatus;
  isMine: boolean;
  neighboringBombCount: number;
}
