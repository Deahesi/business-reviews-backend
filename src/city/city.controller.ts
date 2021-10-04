import { Controller, Get, Query } from '@nestjs/common';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('companies')
  async getCompaniesByCity(@Query('city') city: string) {
    const reformattedCity = city.split('+').join(' ')
    const companies = await this.cityService.getCompaniesByCity(reformattedCity)
    return companies
  }
}
