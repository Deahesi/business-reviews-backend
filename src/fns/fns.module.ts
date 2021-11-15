import { Module } from '@nestjs/common';
import { FnsService } from './fns.service';
import { FnsController } from './fns.controller';
import { HttpModule } from '@nestjs/axios';
import { CompanyModule } from '../company/company.module';

@Module({
  providers: [FnsService],
  imports: [
    HttpModule,
    CompanyModule
  ],
  controllers: [FnsController]
})
export class FnsModule {}
