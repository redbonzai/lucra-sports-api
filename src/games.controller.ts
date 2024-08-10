import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { GameResponseDto } from './dto/game-response.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async getAll(): Promise<GameResponseDto[]> {
    return await this.gamesService.getAllGames();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GameResponseDto> {
    const game = await this.gamesService.findOneGame(id);

    if (!game) {
      throw new NotFoundException(`Game with id "${id}" not found`);
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
}
