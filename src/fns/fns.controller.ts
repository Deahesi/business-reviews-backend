import { Controller, Get } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FnsService } from './fns.service';

@Controller('fns')
export class FnsController {
  constructor(private readonly fnsService: FnsService) {
  }

  @Cron('10 00 2 1 * *')
  async startCompaniesDownload() {
    return await this.fnsService.startCompaniesDownload();
  }

  @Get('')
  async startCompaniesDownloadEndpoint() {
    if (process.env.NODE_ENV === 'development') {
      return await this.fnsService.startCompaniesDownload();
    }
  }
}
