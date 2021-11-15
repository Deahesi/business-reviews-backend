import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyModel } from '../company/company.model';
import { CompanyModule } from '../company/company.module';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { CityModel } from './city.model';
import { CitySearchService } from './city-search.service';
import { SearchModule } from '../search/search.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [CityController],
  providers: [CityService, CitySearchService],
  imports: [
    SearchModule,
    HttpModule,
    SequelizeModule.forFeature([CityModel, CompanyModel]),
  ],
  exports: [CityService]
})
export class CityModule {}
