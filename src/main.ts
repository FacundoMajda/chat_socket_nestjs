import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Permite solo las propiedades definidas en las clases DTO
      forbidNonWhitelisted: true, // Rechaza las propiedades no definidas en las clases DTO
      disableErrorMessages: true, // Habilita los mensajes de error detallados
    }),
  );

  await app.listen(3000);
}
bootstrap();
