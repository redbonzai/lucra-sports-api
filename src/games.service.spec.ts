import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, it, expect } from '@jest/globals';
import { GamesService } from './games.service';
import { GameRepository } from './repositories/game.repository';
import { GameCellRepository } from './repositories/game-cell.repository';
import { CellStatus, Game, GameCell, GameStatus } from './entities';
import { UpdateGameDto } from './dto/update-game.dto';

describe('GamesService', () => {
  let service: GamesService;

  // eslint-disable-next-line no-undef
  let gameRepository: jest.Mocked<GameRepository>;

  // eslint-disable-next-line no-undef
  let gameCellRepository: jest.Mocked<GameCellRepository>;


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
      expect(result.cells).toHaveLength(rows * columns);
    });
  });

  describe('updateGame', () => {
    it('should update a game and its cells successfully', async () => {
      const gameId = 'game-id-1';
      const updateGameDto: UpdateGameDto = {
        id: gameId,
        status: GameStatus.Completed,
        cells: [
          { id: 'cell-id-1', status: CellStatus.Hidden },
          { id: 'cell-id-2', status: CellStatus.Hidden },
        ],
      };

      const mockGame: Game = {
        id: gameId,
        rows: 2,
        columns: 2,
        status: GameStatus.Pending,
        cells: [
          {
            id: 'cell-id-1',
            status: CellStatus.Hidden,
            game: new Game(),
            xCoordinate: 0,
            yCoordinate: 0,
            isMine: false,
            neighboringBombCount: 0,
          },
          {
            id: 'cell-id-2',
            status: CellStatus.Revealed,
            game: new Game(),
            xCoordinate: 1,
            yCoordinate: 1,
            isMine: false,
            neighboringBombCount: 0,
          },
        ],
      };

      // eslint-disable-next-line no-undef
      gameRepository.findOneGameWithCells = jest
        .fn()
        .mockResolvedValue(mockGame);
      // eslint-disable-next-line no-undef
      gameRepository.save = jest.fn().mockResolvedValue({
        ...mockGame,
        status: GameStatus.Completed,
      });

      // Mock the createQueryBuilder chain for updating cells
      const mockQueryBuilder = {
        // eslint-disable-next-line no-undef
        update: jest.fn().mockReturnThis(),
        // eslint-disable-next-line no-undef
        set: jest.fn().mockReturnThis(),
        // eslint-disable-next-line no-undef
        where: jest.fn().mockReturnThis(),
        // eslint-disable-next-line no-undef
        execute: jest.fn().mockResolvedValue({}),
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line no-undef
      gameCellRepository.createQueryBuilder = jest.fn(() => mockQueryBuilder);

      const result = await service.updateGame(gameId, updateGameDto);

      expect(result.status).toBe(GameStatus.Completed);
      expect(gameRepository.findOneGameWithCells).toHaveBeenCalledWith(gameId);
      expect(gameRepository.save).toHaveBeenCalledWith({
        ...mockGame,
        status: GameStatus.Completed,
      });
      expect(mockQueryBuilder.update).toHaveBeenCalledTimes(2); // 2 cells being updated
      expect(mockQueryBuilder.update().set).toHaveBeenCalledWith({
        status: CellStatus.Hidden,
      });
      expect(mockQueryBuilder.execute).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if the game is not found', async () => {
      const gameId = 'non-existent-id';

      // eslint-disable-next-line no-undef
      jest
        .spyOn(gameRepository, 'findOneGameWithCells')
        .mockResolvedValue(null);

      const updateData = {
        id: gameId,
        status: GameStatus.Completed,
        cells: [],
      } as UpdateGameDto;

      await expect(service.updateGame(gameId, updateData)).rejects.toThrowError(
        'Game not found',
      );

      expect(gameRepository.findOneGameWithCells).toHaveBeenCalledWith(gameId);
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


      gameRepository.findOneGameWithCells.mockResolvedValue(mockGame);
      const result = await service.findOneGame(gameId);

      expect(gameRepository.findOneGameWithCells).toHaveBeenCalledWith(gameId);
      expect(result).toEqual(mockGame);
    });

    it('should return null if the game is not found', async () => {
      const gameId = 'non-existent-id';

      gameRepository.findOneGameWithCells.mockResolvedValue(null);

      const result = await service.findOneGame(gameId);

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
