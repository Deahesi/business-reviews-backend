import { CacheModule, Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewModel } from './review.model';
import { CompanyModel } from '../company/company.model';
import { CompanyModule } from '../company/company.module';
import { FilesModule } from '../files/files.module';
import { ReviewAdminService } from './review.admin.service';

@Module({
  imports: [
    SequelizeModule.forFeature([ReviewModel, CompanyModel]),
    FilesModule,
    CompanyModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewAdminService],
  exports: [ReviewService, ReviewAdminService]
})
export class ReviewModule {}
