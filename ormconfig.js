module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'local',
  password: 'local',
  database: 'local',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  synchronize: false, // Ensure this is false in production
  logging: true,
};
