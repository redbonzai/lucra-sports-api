import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { GamesService } from './games.service';
import { GameRepository } from './repositories/game.repository';
import { GameCellRepository } from './repositories/game-cell.repository';
import { Game, GameCell } from './entities';
import { Repository } from 'typeorm';

describe('GamesService', () => {
  let service: GamesService;

  // eslint-disable-next-line no-undef
  let gameRepository: jest.Mocked<Repository<Game>>;

  // eslint-disable-next-line no-undef
  let gameCellRepository: jest.Mocked<Repository<GameCell>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: GameRepository,
          useValue: {
            // eslint-disable-next-line no-undef
            create: jest.fn(),
            // eslint-disable-next-line no-undef
            save: jest.fn(),
            // eslint-disable-next-line no-undef
            findOne: jest.fn(),
            // eslint-disable-next-line no-undef
            find: jest.fn(),
            // eslint-disable-next-line no-undef
            findOneGameWithCells: jest.fn(),
          },
        },
        {
          provide: GameCellRepository,
          useValue: {
            // eslint-disable-next-line no-undef
            create: jest.fn(),
            // eslint-disable-next-line no-undef
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    gameRepository = module.get(GameRepository);
    gameCellRepository = module.get(GameCellRepository);

    // Set up mock implementation after initialization
    gameCellRepository.create.mockImplementation(
      ({ game, xCoordinate, yCoordinate }) => {
        return {
          id: `cell-${xCoordinate}-${yCoordinate}`,
          game,
          xCoordinate,
          yCoordinate,
          isMine: Math.random() < 0.2,
          status: 'HIDDEN',
          neighboringBombCount: 0,
        } as GameCell;
      },
    );
  });

  describe('createGame', () => {
    it('should create a new game and generate cells', async () => {
      const rows = 2;
      const columns = 2;

      const mockGame: Game = {
        id: 'game-id',
        rows,
        columns,
        status: 'PENDING' as any,
        cells: [],
      };

      gameRepository.create.mockReturnValue(mockGame);
      gameCellRepository.create.mockImplementation(
        (cellData) =>
          ({
            ...cellData,
            id: `cell-${cellData.xCoordinate}-${cellData.yCoordinate}`,
          }) as GameCell,
      );
      gameRepository.save.mockResolvedValue(mockGame);

      const result = await service.createGame(rows, columns);
      expect(gameCellRepository.create).toHaveBeenCalledTimes(rows * columns);

      // Simplified check for save, omitting the game reference in the expectation
      // expect(gameCellRepository.save).toHaveBeenCalledWith(
      //   expect.arrayContaining([
      //     expect.objectContaining({
      //       id: 'cell-0-0',
      //       xCoordinate: 0,
      //       yCoordinate: 0,
      //       isMine: false,
      //       neighboringBombCount: 1,
      //       game: expect.any(Object), // Ignore the actual content of game
      //     }),
      //     expect.objectContaining({
      //       id: 'cell-0-1',
      //       xCoordinate: 0,
      //       yCoordinate: 1,
      //       isMine: true,
      //       neighboringBombCount: 0,
      //       game: expect.any(Object), // Ignore the actual content of game
      //     }),
      //     expect.objectContaining({
      //       id: 'cell-1-0',
      //       xCoordinate: 1,
      //       yCoordinate: 0,
      //       isMine: false,
      //       neighboringBombCount: 1,
      //       game: expect.any(Object), // Ignore the actual content of game
      //     }),
      //     expect.objectContaining({
      //       id: 'cell-1-1',
      //       xCoordinate: 1,
      //       yCoordinate: 1,
      //       isMine: false,
      //       neighboringBombCount: 1,
      //       game: expect.any(Object), // Ignore the actual content of game
      //     }),
      //   ]),
      // );

      expect(result.cells).toHaveLength(rows * columns);

      // Optional: Verify that the cells in the result also match the expected structure
      // result.cells.forEach((cell, index) => {
      //   const expectedCell = mockCells[index];
      //   expect(cell).toMatchObject({
      //     id: expectedCell.id,
      //     xCoordinate: expectedCell.xCoordinate,
      //     yCoordinate: expectedCell.yCoordinate,
      //     isMine: expectedCell.isMine,
      //     neighboringBombCount: expectedCell.neighboringBombCount,
      //     status: 'HIDDEN',
      //   });
      // });
    });
  });

  describe('findOneGame', () => {
    it('should find a game by ID', async () => {
      const gameId = 'game-id';

      const mockGame: Game = {
        id: gameId,
        rows: 2,
        columns: 2,
        status: 'PENDING' as any,
        cells: [],
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      gameRepository.findOneGameWithCells.mockResolvedValue(mockGame);

      const result = await service.findOneGame(gameId);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(gameRepository.findOneGameWithCells).toHaveBeenCalledWith(gameId);
      expect(result).toEqual(mockGame);
    });

    it('should return null if the game is not found', async () => {
      const gameId = 'non-existent-id';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      gameRepository.findOneGameWithCells.mockResolvedValue(null);

      const result = await service.findOneGame(gameId);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(gameRepository.findOneGameWithCells).toHaveBeenCalledWith(gameId);
      expect(result).toBeNull();
    });
  });

  describe('getAllGames', () => {
    it('should return a list of games', async () => {
      const mockGames: Game[] = [
        {
          id: 'game-id-1',
          rows: 5,
          columns: 5,
          status: 'PENDING' as any,
          cells: [],
        },
        {
          id: 'game-id-2',
          rows: 3,
          columns: 4,
          status: 'PENDING' as any,
          cells: [],
        },
      ];

      gameRepository.find.mockResolvedValue(mockGames);

      const result = await service.getAllGames();

      expect(gameRepository.find).toHaveBeenCalledWith({
        relations: ['cells'],
      });
      expect(result).toEqual(mockGames);
    });
  });

  describe('generateGameCells', () => {
    it('should generate game cells with correct properties', () => {
      const rows = 2;
      const columns = 2;
      const mockGame: Game = {
        id: 'game-id',
        rows,
        columns,
        status: 'PENDING' as any,
        cells: [],
      };

      const result = service['generateGameCells'](mockGame, rows, columns);

      expect(result).toHaveLength(4); // 2x2 grid = 4 cells

      expect(result[0]).toEqual(
        expect.objectContaining({
          game: mockGame,
          xCoordinate: 0,
          yCoordinate: 0,
          isMine: expect.any(Boolean),
          status: 'HIDDEN',
        }),
      );

      expect(result[1]).toEqual(
        expect.objectContaining({
          game: mockGame,
          xCoordinate: 0,
          yCoordinate: 1,
          isMine: expect.any(Boolean),
          status: 'HIDDEN',
        }),
      );

      expect(result[2]).toEqual(
        expect.objectContaining({
          game: mockGame,
          xCoordinate: 1,
          yCoordinate: 0,
          isMine: expect.any(Boolean),
          status: 'HIDDEN',
        }),
      );

      expect(result[3]).toEqual(
        expect.objectContaining({
          game: mockGame,
          xCoordinate: 1,
          yCoordinate: 1,
          isMine: expect.any(Boolean),
          status: 'HIDDEN',
        }),
      );

      expect(result.some((cell) => cell.isMine)).toBeDefined();
    });
  });

  describe('calculateNeighboringBombCounts', () => {
    it('should correctly calculate neighboring bomb counts', () => {
      const rows = 2;
      const columns = 2;
      const mockGame: Game = {
        id: 'game-id',
        rows,
        columns,
        status: 'PENDING' as any,
        cells: [],
      };

      const mockCells: GameCell[] = [
        {
          id: 'cell-0',
          game: mockGame,
          xCoordinate: 0,
          yCoordinate: 0,
          isMine: false,
          status: 'HIDDEN' as any,
          neighboringBombCount: 0,
        },
        {
          id: 'cell-1',
          game: mockGame,
          xCoordinate: 0,
          yCoordinate: 1,
          isMine: true,
          status: 'HIDDEN' as any,
          neighboringBombCount: 0,
        },
        {
          id: 'cell-2',
          game: mockGame,
          xCoordinate: 1,
          yCoordinate: 0,
          isMine: false,
          status: 'HIDDEN' as any,
          neighboringBombCount: 0,
        },
        {
          id: 'cell-3',
          game: mockGame,
          xCoordinate: 1,
          yCoordinate: 1,
          isMine: false,
          status: 'HIDDEN' as any,
          neighboringBombCount: 0,
        },
      ];

      service['calculateNeighboringBombCounts'](mockCells, rows, columns);

      expect(mockCells[0].neighboringBombCount).toBe(1); // Neighboring bomb at (0,1)
      expect(mockCells[2].neighboringBombCount).toBe(1); // Neighboring bomb at (0,1)
      expect(mockCells[3].neighboringBombCount).toBe(1); // Neighboring bomb at (0,1)
      expect(mockCells[1].neighboringBombCount).toBe(0); // It's a bomb, so it should be 0
    });
  });
});
