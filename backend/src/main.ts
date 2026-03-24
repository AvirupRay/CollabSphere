import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (required for Next.js frontend later)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // strip unknown properties
      forbidNonWhitelisted: true,   // throw error if extra fields sent
      transform: true,              // auto-transform payload types
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();