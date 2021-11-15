import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { Timeout } from '@nestjs/schedule';
import { SearchCityDto } from './dto/search-city.dto';

interface DTO {
  city: string
}

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  // @Post('companies')
  // async getCompaniesByCity(@Body() dto: DTO) {
  //   const companies = await this.cityService.getCity(dto.city)
  //   return companies
  // }

  @Get('')
  async getAllCities() {
    return await this.cityService.getCities()
  }

  @Post('search')
  async searchCities(@Body() dto: SearchCityDto) {
    return await this.cityService.searchCity(dto)
  }
}

