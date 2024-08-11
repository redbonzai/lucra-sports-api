// test/connection.ts
import { TestDataSource } from '../src/data-source/data-source.test';

export const initializeTestDatabase = async () => {
  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
  }
};

export const closeTestDatabase = async () => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
};

export const clearTestDatabase = async () => {
  const entities = TestDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = TestDataSource.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName}`);
  }
};
