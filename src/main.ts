import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './pipes/validation.pipe';
import { runInCluster } from './utils/runInCluster';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Business Reviews backend endpoints')
    .setDescription('Documentation backend API')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  app.useGlobalPipes(new ValidationPipe())

  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? 'https://бизнес-отзывы.рф' : 'http://localhost:3000',
    credentials: true
  })
  await app.listen(7000);
}
runInCluster(bootstrap)
