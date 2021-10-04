import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyModel } from './company.model';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { ReviewModel } from '../review/review.model';
import { CityModule } from '../city/city.module';
import { CityModel } from '../city/city.model';

@Module({
  imports: [
    SequelizeModule.forFeature([CompanyModel, ReviewModel, CityModel]),
    CityModule
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService]
})
export class CompanyModule {}
