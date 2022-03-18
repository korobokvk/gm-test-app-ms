import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { graphqlUploadExpress } from 'graphql-upload';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['verbose', 'error', 'log'],
  });
  const configService = app.get(ConfigService);

  app.use(graphqlUploadExpress());
  await app.listen(configService.get('PORT'));
}
bootstrap();
