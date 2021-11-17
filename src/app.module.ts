import { CacheModule, Module } from '@nestjs/common';
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
import { EmailModule } from './email/email.module';
import { FilesModule } from './files/files.module';
import * as redisStore from 'cache-manager-redis-store';
import { ScheduleModule } from '@nestjs/schedule';
import { FnsModule } from './fns/fns.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CacheModule.register({
        store: redisStore,
        // Store-specific configuration:
        host: 'localhost',
        port: 6379,
        isGlobal: true
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: path.resolve(__dirname, 'static')
    // }),
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_LOGIN,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_AUTHDATABASE,
        models: [CompanyModel, ReviewModel, CityModel, ModeratorModel],
        autoLoadModels: true
      })
    }),
    SearchModule,
    CityModule,
    FilesModule,
    CompanyModule,
    ReviewModule,
    AdminModule,
    EmailModule,
    FnsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}
