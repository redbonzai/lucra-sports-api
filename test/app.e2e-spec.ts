import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { describe, beforeEach, it } from '@jest/globals';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/games (GET)', () => {
    return request(app.getHttpServer())
      .get('/games')
      .expect(200)
      .expect([
        {
          id: '19248dcb-683e-4a12-bf12-e5953a2e6e30',
          status: 'PENDING',
          rows: 3,
          columns: 4,
          cells: [
            {
              id: '7e614fed-ff74-4c74-88cd-764aff40eb02',
              status: 'HIDDEN',
              xCoordinate: 0,
              yCoordinate: 0,
              isMine: false,
              neighboringBombCount: 0,
            },
            {
              id: 'b2479c8f-bb69-4310-92e5-7f25703bbd76',
              status: 'HIDDEN',
              xCoordinate: 0,
              yCoordinate: 1,
              isMine: false,
              neighboringBombCount: 0,
            },
            {
              id: '7c14efac-1584-443f-ae3f-656f604482ca',
              status: 'HIDDEN',
              xCoordinate: 0,
              yCoordinate: 2,
              isMine: false,
              neighboringBombCount: 1,
            },
            {
              id: '65ee4333-9e8f-440e-844e-695925c47d85',
              status: 'HIDDEN',
              xCoordinate: 0,
              yCoordinate: 3,
              isMine: false,
              neighboringBombCount: 1,
            },
            {
              id: 'dfdb6971-5263-4f3c-a6f4-810665bee295',
              status: 'HIDDEN',
              xCoordinate: 1,
              yCoordinate: 0,
              isMine: false,
              neighboringBombCount: 1,
            },
            {
              id: 'd66b2271-ac0b-4a4f-b746-ca4d6b46fb47',
              status: 'HIDDEN',
              xCoordinate: 1,
              yCoordinate: 1,
              isMine: false,
              neighboringBombCount: 1,
            },
            {
              id: '50a9ed8b-beec-4486-92d1-96195d87a721',
              status: 'HIDDEN',
              xCoordinate: 1,
              yCoordinate: 2,
              isMine: false,
              neighboringBombCount: 1,
            },
            {
              id: '24a32cd7-8375-42af-96d1-6631d56b385a',
              status: 'HIDDEN',
              xCoordinate: 1,
              yCoordinate: 3,
              isMine: true,
              neighboringBombCount: 0,
            },
            {
              id: '46cc7d41-2814-436a-b34d-b00df56d00b1',
              status: 'HIDDEN',
              xCoordinate: 2,
              yCoordinate: 0,
              isMine: true,
              neighboringBombCount: 0,
            },
            {
              id: '10f78489-03a5-40ac-8331-8cded1447149',
              status: 'HIDDEN',
              xCoordinate: 2,
              yCoordinate: 1,
              isMine: false,
              neighboringBombCount: 1,
            },
            {
              id: 'afb454f7-6307-48c4-a1b6-d7c74260fc76',
              status: 'HIDDEN',
              xCoordinate: 2,
              yCoordinate: 2,
              isMine: false,
              neighboringBombCount: 1,
            },
            {
              id: '77055ace-a088-496b-b169-5d4f7f761fa6',
              status: 'HIDDEN',
              xCoordinate: 2,
              yCoordinate: 3,
              isMine: false,
              neighboringBombCount: 1,
            },
          ],
        },
      ]);
  });
});
