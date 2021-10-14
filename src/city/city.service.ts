import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CityModel } from './city.model';
import { CompanyModel } from '../company/company.model';

@Injectable()
export class CityService {
  constructor(@InjectModel(CityModel) private cityRepository: typeof CityModel) {
  }

  async addCompanyToCity(company: CompanyModel) {
    const [city, created] = await this.cityRepository.findOrCreate({ where: { city: company.city }, defaults: {
        city: company.city
    }})

    await city.$set('city_companies', [...await city.$get('city_companies'), company])
    return city
  }

  async getCompaniesByCity(city: string, page: number) {
    const companies = await this.cityRepository.findOne({ limit: 10, offset: (page - 1) * 10, where: { city },  include: [{ model: CompanyModel }]  })
    return companies.city_companies
  }
}
