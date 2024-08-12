import { DataSource } from 'typeorm';
import { join } from 'path';
import { Game, GameCell } from '../entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '0.0.0.0',
  port: 5432,
  username: 'local',
  password: 'local',
  database: 'local',
  entities: [Game, GameCell],
  // eslint-disable-next-line no-undef
  migrations: [join(__dirname + '/../migrations/*{.ts,.js}')],
  synchronize: true,
});

// Call initialize only if necessary, usually within your app's entry point.
AppDataSource.initialize()
  .then(() => {
    // eslint-disable-next-line no-undef
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    // eslint-disable-next-line no-undef
    console.error('Error during Data Source initialization', err);
  });
