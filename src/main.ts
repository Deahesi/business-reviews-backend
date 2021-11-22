import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './pipes/validation.pipe';
import { runInCluster } from './utils/runInCluster';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')

  const PORT = 7000 || 7001 || 7002 || 7003 || 7004 || 7005 || 7006 || 7007

  const config = new DocumentBuilder()
    .setTitle('Business Reviews backend endpoints')
    .setDescription('Documentation backend API')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  app.useGlobalPipes(new ValidationPipe())

  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? ['https://xn----9sbekjcd5bl2an3ib.xn--p1ai', 'https://176.99.12.116/', 'http://бизнес-отзывы.рф', 'http://xn----9sbekjcd5bl2an3ib.xn--p1ai'] : 'http://localhost:3000',
    credentials: true
  })
  await app.listen(PORT);
}
bootstrap()
