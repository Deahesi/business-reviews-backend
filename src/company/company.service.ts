import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CompanyModel } from './company.model';
import { CompanyDto } from './dto/company.dto';
import { ReviewModel } from '../review/review.model';
import { CityService } from '../city/city.service';

@Injectable()
export class CompanyService {
  constructor(@InjectModel(CompanyModel) private companyRepository: typeof CompanyModel,
              private readonly cityService: CityService) {
  }

  async createCompany(dto: CompanyDto) {
    const company = await this.companyRepository.create(dto);
    await this.cityService.addCompanyToCity(company)
    return company;
  }

  async getCompanyById(id: number) {
    const company = await this.companyRepository.findByPk(id, { include: [{ model: ReviewModel }]  })
    return company
  }

  async getCompanyByName(company_name: string) {
    const company = await this.companyRepository.findOne({ where: { name: company_name }  })
    return company
  }
}
