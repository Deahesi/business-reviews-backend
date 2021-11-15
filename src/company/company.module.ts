import { CacheModule, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyModel } from './company.model';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { ReviewModel } from '../review/review.model';
import { CityModule } from '../city/city.module';
import { CityModel } from '../city/city.model';
import { CompanySearchService } from './company-search.service';
import { SearchModule } from '../search/search.module';
import { HttpModule } from '@nestjs/axios';
import { FilesModule } from '../files/files.module';
import { CompanyAdminService } from './company.admin.service';

@Module({
  imports: [
    CacheModule.register(),
    FilesModule,
    HttpModule,
    SearchModule,
    SequelizeModule.forFeature([CompanyModel, ReviewModel, CityModel]),
    CityModule,
  ],
  providers: [CompanyService, CompanySearchService, CompanyAdminService],
  controllers: [CompanyController],
  exports: [CompanyService, CompanySearchService, CompanyAdminService]
})
export class CompanyModule {}
