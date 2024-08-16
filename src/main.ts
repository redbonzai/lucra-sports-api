import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger as PinoLogger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(PinoLogger);
  await app.listen(3000);
  logger.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
