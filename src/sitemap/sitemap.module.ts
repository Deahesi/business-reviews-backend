import { Module } from '@nestjs/common';
import { SitemapController } from './sitemap.controller';
import { CompanyModule } from '../company/company.module';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [CompanyModule, ReviewModule],
  controllers: [SitemapController]
})
export class SitemapModule {}
