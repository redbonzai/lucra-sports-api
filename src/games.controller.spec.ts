import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game, GameCell } from './entities';
import { AppModule } from './app.module';

describe('GamesController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Game, GameCell],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/games (GET)', () => {
    it('should return a list of available games', async () => {
      // Create a game first
      await request(app.getHttpServer())
        .post('/games')
        .send({ rows: 3, columns: 4 })
        .expect(201);

      // Then retrieve all games
      const response = await request(app.getHttpServer())
        .get('/games')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
