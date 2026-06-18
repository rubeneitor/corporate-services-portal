import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedDatabase } from './database/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  const dataSource = app.get(DataSource);

  if (process.env.NODE_ENV !== 'production') {
    const hasUsers = await dataSource.getRepository('User').count();

    if (hasUsers === 0) {
      await seedDatabase(dataSource);
    }
  }

  console.log(`Application running on: ${await app.getUrl()}`);
}
bootstrap();
