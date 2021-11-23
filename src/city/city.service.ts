import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CityModel } from './city.model';
import { CompanyModel } from '../company/company.model';
import * as cities from './data/cities.json'
import { CitySearchService } from './city-search.service';
import { ValidationException } from '../exceptions/validation.exception';
import { SearchCityDto } from './dto/search-city.dto';
import { Op } from 'sequelize';

@Injectable()
export class CityService implements OnModuleInit {
  constructor(@InjectModel(CityModel) private cityRepository: typeof CityModel,
              private readonly citySearchService: CitySearchService) {
  }

  async addCompanyToCity(company: CompanyModel) {
    const city = await this.cityRepository.findOne({
      where: { city: company.city }
    });

    if (!city) {
      throw new ValidationException([{
        field: 'city',
        errors: ['No city with this name']
      }])
    }

    this.citySearchService.indexCity(city)

    await city.$set('city_companies', [...await city.$get('city_companies'), company]);
    return city;
  }

  async getCity(city: string) {
    const cityRes = await this.cityRepository.findOne({
      where: { city }
    });
    if (!cityRes) {
      throw new ValidationException([{
        field: 'city',
        errors: ['No city with this name']
      }])
    }
    return cityRes;
  }

  // async createCity(city: string) {
  //   const cityRes = await this.cityRepository.findOrCreate(({
  //     where: { city }
  //   }))
  //   if (!cityRes) {
  //     throw new ValidationException([{
  //       field: 'city',
  //       errors: ['No city with this name']
  //     }])
  //   }
  //   return cityRes;
  // }

  async getCities() {
    return (await this.cityRepository.findAll({ limit: 100 })).map((c) => c.getCity());
  }

  async onModuleInit() {
    // TODO: Исправить
    await this.citySearchService.removeAllIndexes()
    await this.updateCities()
  }

  async updateCities() {
    for (const city of cities) {
      const upperCity = city.city.toUpperCase()
      const [result, created] = await this.cityRepository.findOrCreate({
        where: { city: upperCity },
        defaults: {
          city: upperCity
        }
      });
      if (created) await this.citySearchService.indexCity(result)
    }
  }

  async searchCity(dto: SearchCityDto) {
    let ids = [];
    if (dto.query && dto.query !== '') {
      const results = await this.citySearchService.search(dto.query.toUpperCase());
      ids = results.map(result => result.id);
    }
    if (!ids.length) {
      return [];
    }

    return (await this.cityRepository.findAll({
      where: { id: { [Op.in]: ids} }
    })).map((c) => c.city);
  }

  async getCityOrCreate(city: string) {
    const [cityRes, created] = await this.cityRepository.findOrCreate({
      where: { city: city.toUpperCase() },
      defaults: {
        city: city.toUpperCase()
      }
    });
    return cityRes;
  }

  async getAllCities() {
    return (await this.cityRepository.findAll()).map((c) => c.getCity());
  }
}
