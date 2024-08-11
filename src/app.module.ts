import 'reflect-metadata';
import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GameRepository } from './repositories/game.repository';
import { TypeOrmExModule } from './typeorm-ex-module/typeorm-ex.module';
import { GameCell } from './entities';
import { GameCellRepository } from './repositories/game-cell.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '0.0.0.0',
      port: 5432,
      username: 'local',
      password: 'local',
      database: 'local',
      entities: [join(__dirname, 'entities/*')],
      synchronize: true,
    }),
    TypeOrmExModule.forCustomRepository([GameRepository, GameCellRepository]),
  ],
  controllers: [GamesController],
  providers: [GamesService],
})
export class AppModule {}
