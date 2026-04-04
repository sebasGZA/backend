import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfiguration } from './shared/swagger/config/swagger.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT || '3000');
  swaggerConfiguration(app);
  app.setGlobalPrefix('api');

  await app.listen(port, () => {
    Logger.log(`Server running on port ${port}`, 'main');
  });
}
bootstrap();
