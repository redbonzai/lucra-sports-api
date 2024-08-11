import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';

describe('GamesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Optionally clear the database here to ensure a clean state
    const connection = getConnection();
    await connection.synchronize(true); // Drops and recreates the database schema
  });

  afterAll(async () => {
    await getConnection().close();
    await app.close();
  });

  it('/games (POST) should create a new game', async () => {
    const response = await request(app.getHttpServer())
      .post('/games')
      .send({ rows: 5, columns: 5 })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('status', 'PENDING');
    expect(response.body).toHaveProperty('rows', 5);
    expect(response.body).toHaveProperty('columns', 5);
    expect(response.body.cells.length).toBe(25); // 5x5 grid
  });

  it('/games (GET) should retrieve all games', async () => {
    const response = await request(app.getHttpServer())
      .get('/games')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((game) => {
      expect(game).toHaveProperty('id');
      expect(game).toHaveProperty('status');
      expect(game).toHaveProperty('rows');
      expect(game).toHaveProperty('columns');
      expect(Array.isArray(game.cells)).toBe(true);
    });
  });

  it('/games/:id (GET) should retrieve a specific game', async () => {
    const { body: newGame } = await request(app.getHttpServer())
      .post('/games')
      .send({ rows: 5, columns: 5 })
      .expect(201);

    const { body: retrievedGame } = await request(app.getHttpServer())
      .get(`/games/${newGame.id}`)
      .expect(200);

    expect(retrievedGame).toHaveProperty('id', newGame.id);
    expect(retrievedGame).toHaveProperty('rows', 5);
    expect(retrievedGame).toHaveProperty('columns', 5);
  });

  it('/games/:id (GET) should return 404 for a non-existent game', async () => {
    const nonExistentId = 'non-existent-id';

    await request(app.getHttpServer())
      .get(`/games/${nonExistentId}`)
      .expect(404);
  });
});
