import { Controller, Get, Param } from '@nestjs/common';
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

  @Cron('5 2 * * *')
  async startCompaniesUpdate() {
    return await this.fnsService.startCompaniesUpdate();
  }




  @Get('')
  async startCompaniesDownloadEndpoint() {
    if (process.env.NODE_ENV === 'development') {
      return await this.fnsService.startCompaniesDownload();
    }
  }

  @Get('reset/:n')
  async resetCompaniesDownloadEndpoint(@Param() params) {
    if (process.env.NODE_ENV !== 'development') {
      return await this.fnsService.resetCompaniesDownload(parseInt(params.n));
    }
  }

  @Get('update')
  async startCompaniesUpdateEndpoint() {
    if (process.env.NODE_ENV === 'development') {
      return await this.fnsService.startCompaniesUpdate();
    }
  }
}
