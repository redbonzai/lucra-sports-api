import { Repository } from 'typeorm';
import { GameCell } from '../entities';
import { CustomRepository } from '../decorators/typeorm-ex.decorator';

@CustomRepository(GameCell)
export class GameCellRepository extends Repository<GameCell> {
  // Add any custom methods for GameCell entity if needed
}
