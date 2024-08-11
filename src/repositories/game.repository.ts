import { Repository } from 'typeorm';
import { Game } from '../entities';
import { CustomRepository } from '../decorators/typeorm-ex.decorator';

@CustomRepository(Game)
export class GameRepository extends Repository<Game> {
  async findAllGamesWithCells(): Promise<Game[]> {
    return this.find({ relations: ['cells'] });
  }

  async findOneGameWithCells(id: string): Promise<Game | null> {
    return this.findOne({
      where: { id },
      relations: ['cells'],
    });
  }
}
