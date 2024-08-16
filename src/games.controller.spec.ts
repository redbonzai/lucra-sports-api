import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { FindOneGameParams } from './dto/find-one-game-param.dto';
import { Game, GameStatus, GameCell, CellStatus } from './entities';
import { UpdateGameDto } from './dto/update-game.dto';

describe('GamesController', () => {
  let gamesController: GamesController;
  let gamesService: GamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: {
            // eslint-disable-next-line no-undef
            getAllGames: jest.fn(),
            // eslint-disable-next-line no-undef
            findOneGame: jest.fn(),
            // eslint-disable-next-line no-undef
            createGame: jest.fn(),
            // eslint-disable-next-line no-undef
            updateGame: jest.fn(),
          },
        },
      ],
    }).compile();

    gamesController = module.get<GamesController>(GamesController);
    gamesService = module.get<GamesService>(GamesService);
  });

  describe('getAll', () => {
    it('should return an array of games', async () => {
      const mockGames: Game[] = [
        {
          id: 'game-id-1',
          rows: 2,
          columns: 2,
          status: GameStatus.Pending,
          cells: [] as GameCell[],
        },
        {
          id: 'game-id-2',
          rows: 3,
          columns: 3,
          status: GameStatus.Pending,
          cells: [] as GameCell[],
        },
      ];

      // eslint-disable-next-line no-undef
      jest.spyOn(gamesService, 'getAllGames').mockResolvedValue(mockGames);

      const result = await gamesController.getAll();

      expect(result).toEqual(mockGames);
      expect(gamesService.getAllGames).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a specific game by ID', async () => {
      const mockGame: Game = {
        id: 'game-id-1',
        rows: 2,
        columns: 2,
        status: GameStatus.Pending,
        cells: [] as GameCell[],
      };

      // eslint-disable-next-line no-undef
      jest.spyOn(gamesService, 'findOneGame').mockResolvedValue(mockGame);

      const params: FindOneGameParams = { id: 'game-id-1' };
      const result = await gamesController.findOne(params);

      expect(result).toEqual(mockGame);
      expect(gamesService.findOneGame).toHaveBeenCalledWith('game-id-1');
    });

    it('should throw NotFoundException if the game is not found', async () => {
      // eslint-disable-next-line no-undef
      jest.spyOn(gamesService, 'findOneGame').mockResolvedValue(null);

      const params: FindOneGameParams = { id: 'non-existent-id' };

      await expect(gamesController.findOne(params)).rejects.toThrow(
        NotFoundException,
      );
      expect(gamesService.findOneGame).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('create', () => {
    it('should create a new game', async () => {
      const createGameDto: CreateGameDto = { rows: 2, columns: 2 };
      const mockGame: Game = {
        id: 'new-game-id',
        rows: 2,
        columns: 2,
        status: GameStatus.Pending,
        cells: [] as GameCell[],
      };

      // eslint-disable-next-line no-undef
      jest.spyOn(gamesService, 'createGame').mockResolvedValue(mockGame);

      const result = await gamesController.create(createGameDto);

      expect(result).toEqual(mockGame);
      expect(gamesService.createGame).toHaveBeenCalledWith(2, 2);
    });
  });

  describe('update', () => {
    it('Should update a game successfully', async () => {
      const updateGameDto: UpdateGameDto = {
        id: 'game-id', // Add the missing id field here
        status: GameStatus.Completed,
        cells: [
          {
            id: 'cell-id-1',
            status: CellStatus.Hidden,
          },
          {
            id: 'cell-id-2',
            status: CellStatus.Hidden,
          },
        ],
      };

      const mockGame: Game = {
        id: 'game-id',
        rows: 2,
        columns: 2,
        status: GameStatus.Completed,
        cells: [
          {
            id: 'cell-id-1',
            status: CellStatus.Revealed,
            game: new Game(),
            xCoordinate: 0,
            yCoordinate: 0,
            isMine: false,
            neighboringBombCount: 0,
          },
          {
            id: 'cell-id-2',
            status: CellStatus.Flagged,
            game: new Game(),
            xCoordinate: 1,
            yCoordinate: 1,
            isMine: false,
            neighboringBombCount: 0,
          },
        ],
      };

      // eslint-disable-next-line no-undef
      jest.spyOn(gamesService, 'updateGame').mockResolvedValue(mockGame);

      const result = await gamesController.update(
        { id: 'game-id' },
        updateGameDto,
      );

      expect(result.status).toEqual(GameStatus.Completed);
      expect(result.cells[0].status).toEqual(CellStatus.Revealed);
      expect(result.cells[1].status).toEqual(CellStatus.Flagged);
      expect(gamesService.updateGame).toHaveBeenCalledWith(
        'game-id',
        updateGameDto,
      );
    });
  });
});
