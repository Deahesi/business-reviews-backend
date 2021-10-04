import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewModel } from './review.model';
import { CompanyModel } from '../company/company.model';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ReviewModel, CompanyModel]),
    CompanyModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService]
})
export class ReviewModule {}
