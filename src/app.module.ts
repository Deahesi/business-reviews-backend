import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewModule } from './review/review.module';
import { CompanyModule } from './company/company.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyModel } from './company/company.model';
import { ReviewModel } from './review/review.model';
import { CityModule } from './city/city.module';
import { CityModel } from './city/city.model';
import { AdminModule } from './admin/admin.module';
import { ModeratorModel } from './admin/moderator.model';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'postgres',
        host:  process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_LOGIN,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_AUTHDATABASE,
        models: [CompanyModel, ReviewModel, CityModel, ModeratorModel],
        autoLoadModels: true
      })
    }),
    SearchModule,
    ReviewModule,
    CityModule,
    CompanyModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
