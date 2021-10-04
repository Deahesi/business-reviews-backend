import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyModel } from '../company/company.model';
import { CompanyModule } from '../company/company.module';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { CityModel } from './city.model';

@Module({
  controllers: [CityController],
  providers: [CityService],
  imports: [
    SequelizeModule.forFeature([CityModel, CompanyModel]),
    // CompanyModule
  ],
  exports: [CityService]
})
export class CityModule {}
