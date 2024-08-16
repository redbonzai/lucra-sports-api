import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { GameResponseDto } from './dto/game-response.dto';
import { FindOneGameParams } from './dto/find-one-game-param.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Logger } from '@nestjs/common';

@Controller('games')
export class GamesController {
  private readonly logger = new Logger(GamesController.name);
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async getAll(): Promise<GameResponseDto[]> {
    return await this.gamesService.getAllGames();
  }

  @Get(':id')
  async findOne(@Param() params: FindOneGameParams): Promise<GameResponseDto> {
    const game = await this.gamesService.findOneGame(params.id);

    if (!game) {
      throw new NotFoundException(`Game with id "${params.id}" not found`);
    }

    return game;
  }

  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    return await this.gamesService.createGame(
      createGameDto.rows,
      createGameDto.columns,
    );
  }

  @Patch(':id')
  async update(
    @Param() params: FindOneGameParams,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    try {
      return await this.gamesService.updateGame(params.id, updateGameDto);
    } catch (error) {
      this.logger.error(error);
      throw new NotFoundException(`Game not found`);
    }
  }
}
