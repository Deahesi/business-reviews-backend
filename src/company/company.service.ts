import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CompanyModel } from './company.model';
import { CompanyDto, CompanyExistDto } from './dto/company.dto';
import { ReviewModel } from '../review/review.model';
import { CityService } from '../city/city.service';
import { Op } from 'sequelize';
import { UniqueName } from '../exceptions/unique-name';
import { CompanySearchService } from './company-search.service';
import { SearchCompanyDto } from './dto/search-company.dto';
import { CompanyNotfoundException } from '../exceptions/company-notfound.exception';

@Injectable()
export class CompanyService {
  constructor(@InjectModel(CompanyModel) private companyRepository: typeof CompanyModel,
              private readonly cityService: CityService,
              private readonly companySearchService: CompanySearchService) {
    // setInterval(async () => {
    //   await this.companyRepository.destroy({
    //     where: {
    //       [Op.and]: [
    //         { company_reviews: { [Op.like]: { [Op.any]: [] } } },
    //         { createdAt: { [Op.lte]: new Date(Date.now() - 10000) } }
    //       ]
    //     },
    //   });
    // }, 1000);
  }

  //86400000

  async createCompany(dto: CompanyDto) {
    let company: CompanyModel;
    company = await this.companyRepository.findOne({ where: { name: dto.name } });
    if (company) {
      throw new UniqueName([{
        field: 'company_name',
        errors: ['This field must be unique']
      }]);
    }
    company = await this.companyRepository.create({ ...dto, reviews_count: 0, rating: 0 });
    await this.companySearchService.indexCompany(company);
    await this.cityService.addCompanyToCity(company);
    return company;
  }

  async getCompanyById(id: number) {
    const company = await this.companyRepository.findByPk(id, { include: [{ model: ReviewModel }] });
    if (!company) {
      throw new CompanyNotfoundException([{
        field: 'company',
        errors: ['No company with this id!']
      }]);
    }
    return company;
  }

  async getCompanyByName(company_name: string, reviews: boolean) {
    const company = await this.companyRepository.findOne({
      where: { name: company_name },
      include: reviews ? [{ model: ReviewModel }] : undefined
    });
    return company;
  }

  async checkCompanyExist(dto: CompanyExistDto) {
    const company = await this.companyRepository.findOne({ where: { name: dto.name } });
    return company ? { exist: true } : { exist: false };
  }

  async searchByQuery(dto: SearchCompanyDto) {
    let ids = [];
    if (!dto.query || dto.query === '') {
      ids = (await this.cityService.getCompaniesByCity(dto.city, dto.page)).map((c) => c.id);
    }
    if (dto.query && dto.query !== '') {
      const results = await this.companySearchService.search(dto.query);
      ids = results.map(result => result.id);
    }
    if (!ids.length) {
      return [];
    }
    return (await this.companyRepository.findAll({
      where: { id: { [Op.in]: ids }, city: dto.city },
      include: [{ model: ReviewModel }],
      limit: 10, offset: (dto.page - 1) * 10,
      order: [['rating', 'DESC']]
    })).map((c) => c.getSearchData());
  }


  async searchInput(dto: Omit<SearchCompanyDto, 'page'>) {
    let ids = [];
    const results = await this.companySearchService.search(dto.query);
    ids = results.map(result => result.id);
    if (!ids.length) {
      return [];
    }
    return (await this.companyRepository.findAll({
      where: { id: { [Op.in]: ids }, city: dto.city ?? undefined },
      include: [{ model: ReviewModel }],
      limit: 10,
      order: [['rating', 'DESC']]
    })).map((c) => c.getFastSearchData());
  }
}
