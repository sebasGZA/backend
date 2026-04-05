import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { swaggerConfiguration } from './shared/swagger/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT || '8080');

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  swaggerConfiguration(app);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port, () => {
    Logger.log(`Server running on port ${port}`, 'main');
  });
}
bootstrap();
