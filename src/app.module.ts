import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GameRepository } from './repositories/game.repository';
import { TypeOrmExModule } from './typeorm-ex-module/typeorm-ex.module';
import { GameCellRepository } from './repositories/game-cell.repository';
import { Game, GameCell } from './entities';
import { AppDataSource } from './data-source/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmExModule.forCustomRepository([GameRepository, GameCellRepository]),
    TypeOrmModule.forFeature([Game, GameCell]),
  ],
  controllers: [GamesController],
  providers: [GamesService],
})
export class AppModule {}
