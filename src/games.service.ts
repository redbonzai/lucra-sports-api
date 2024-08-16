import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Game, GameCell } from './entities';
import { GameRepository } from './repositories/game.repository';
import { GameCellRepository } from './repositories/game-cell.repository';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameRepository)
    private gamesRepository: GameRepository,

    @InjectRepository(GameCellRepository)
    private gameCellsRepository: GameCellRepository,
  ) {}

  async createGame(rows: number, columns: number): Promise<Game> {
    const game = this.gamesRepository.create({ rows, columns });
    await this.gamesRepository.save(game);

    const cells = this.generateGameCells(game, rows, columns);
    this.calculateNeighboringBombCounts(cells, rows, columns);
    await this.gameCellsRepository.save(cells);
    game.cells = cells;

    return game;
  }

  private generateGameCells(
    game: Game,
    rows: number,
    columns: number,
  ): GameCell[] {
    const cells: GameCell[] = [];
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < columns; y++) {
        const cell = this.gameCellsRepository.create({
          game,
          xCoordinate: x,
          yCoordinate: y,
          isMine: Math.random() < 0.2, // 20% chance to be a mine
        });
        cells.push(cell);
      }
    }
    return cells;
  }

  private calculateNeighboringBombCounts(
    cells: GameCell[],
    rows: number,
    columns: number,
  ): void {
    const cellMatrix: GameCell[][] = Array.from({ length: rows }, () => []);

    cells.forEach((cell) => {
      cellMatrix[cell.xCoordinate][cell.yCoordinate] = cell;
    });

    cells.forEach((cell) => {
      if (cell.isMine) {
        return;
      }

      const neighboringCells = this.getNeighboringCells(
        cellMatrix,
        cell.xCoordinate,
        cell.yCoordinate,
        rows,
        columns,
      );
      cell.neighboringBombCount = neighboringCells.filter(
        (neighbor) => neighbor.isMine,
      ).length;
    });
  }

  private getNeighboringCells(
    matrix: GameCell[][],
    x: number,
    y: number,
    rows: number,
    columns: number,
  ): GameCell[] {
    const neighbors: GameCell[] = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue; // Skip the cell itself
        const nx = x + i;
        const ny = y + j;
        if (nx >= 0 && nx < rows && ny >= 0 && ny < columns) {
          neighbors.push(matrix[nx][ny]);
        }
      }
    }
    return neighbors;
  }

  async updateGame(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    const game = await this.gamesRepository.findOneGameWithCells(id);

    if (!game) {
      throw new NotFoundException(`Game not found`);
    }

    // update game properties
    Object.assign(game, updateGameDto);

    //update associated game cells
    if (updateGameDto.cells && updateGameDto.cells.length > 0) {
      const updatePromises = updateGameDto.cells.map(
        (updatedCell: GameCell) => {
          return this.gameCellsRepository
            .createQueryBuilder()
            .update(GameCell)
            .set({ status: updatedCell.status })
            .where('id = :id', { id: updatedCell.id })
            .execute();
        },
      );
      await Promise.all(updatePromises);
    }

    return this.gamesRepository.save(game);
  }

  async findOneGame(id: string): Promise<Game | null> {
    return await this.gamesRepository.findOneGameWithCells(id);
  }

  async getAllGames(): Promise<Game[]> {
    return await this.gamesRepository.find({ relations: ['cells'] });
  }
}
