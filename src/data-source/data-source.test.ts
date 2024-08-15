import { DataSource } from 'typeorm';
import { Game, GameCell } from '../entities';

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: '0.0.0.0',
  port: 5445,
  username: 'local',
  password: 'local',
  database: 'test_e2e_db',
  entities: [Game, GameCell],
  synchronize: true,
  dropSchema: true, // Automatically drops the schema at the end of each test
});
