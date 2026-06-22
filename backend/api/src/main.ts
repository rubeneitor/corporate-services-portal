import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedDatabase } from './database/seed';
import { User } from './modules/users/user.entity';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Corporate Services Portal API')
    .setDescription('API for room and services reservations')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  // const corsOrigins = new Set(
  //   [
  //     'http://localhost:4200',
  //     'https://corporate-services-portal-web.onrender.com',
  //     ...(process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) ??
  //       []),
  //   ].filter(Boolean),
  // );
  // const isRenderOrigin = (origin: string) =>
  //   /^https:\/\/[a-z0-9-]+\.onrender\.com$/i.test(origin);

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);

  const dataSource = app.get(DataSource);

  if (process.env.NODE_ENV !== 'production') {
    const hasUsers = await dataSource.getRepository(User).count();

    if (hasUsers === 0) {
      await seedDatabase(dataSource);
    }
  }

  console.log(`Application running on: ${await app.getUrl()}`);
}
bootstrap();
