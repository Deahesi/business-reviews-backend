import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CompanyModel, CompanyType } from './company.model';
import {
  BindCompanyDto,
  CompanyDto,
  CompanyExistDto,
  UpdateCompanyDto,
  UploadCompanyImageDto
} from './dto/company.dto';
import { ReviewModel } from '../review/review.model';
import { CityService } from '../city/city.service';
import { Op } from 'sequelize';
import { UniqueName } from '../exceptions/unique-name';
import { CompanySearchService } from './company-search.service';
import { SearchCompanyDto } from './dto/search-company.dto';
import { CompanyNotfoundException } from '../exceptions/company-notfound.exception';
import { ValidationException } from '../exceptions/validation.exception';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import any = jasmine.any;
import { Cache } from 'cache-manager';
import { FilesService } from '../files/files.service';

class SearchRequestСonvert {
  id?: object;
  city?: string;
  type?: CompanyType;
}

class DadataAddressResponse {
  result: ''
}

@Injectable()
export class CompanyService {
  constructor(@InjectModel(CompanyModel) private companyRepository: typeof CompanyModel,
              private readonly cityService: CityService,
              private readonly companySearchService: CompanySearchService,
              private httpService: HttpService,
              private filesService: FilesService,
              @Inject(CACHE_MANAGER) private cacheManager: Cache) {
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

  async createCompanyOOO(dto: CompanyDto) {
    console.log(dto);
    await this.cityService.getCityOrCreate(dto.city.toUpperCase())
    const company = await this.companyRepository.create({ ...dto,  city: dto.city.toUpperCase(), reviews_count: 0, rating: 0, related_companies: [] })
    await this.cacheManager.set('image-company:' + company.id, true, { ttl: 600 })
    await this.companySearchService.indexCompany(company);
    await this.cityService.addCompanyToCity(company);
    return company ?? '';
  }

  async updateCompanyOOO(dto: CompanyDto) {
    await this.cityService.getCityOrCreate(dto.city.toUpperCase())
    const [company, created] = await this.companyRepository.findOrCreate({
      where: { inn: dto.inn },
      defaults: { ...dto,  city: dto.city.toUpperCase(), reviews_count: 0, rating: 0, related_companies: [] }
    })
    if (created) {
      await this.cacheManager.set('image-company:' + company.id, true, { ttl: 600 })
      await this.companySearchService.indexCompany(company);
      await this.cityService.addCompanyToCity(company);
    } else {
      await this.companySearchService.updateCompany(company)
    }
    return company ?? ''
  }

  async updateCompaniesOOO(dto: CompanyDto) {
    await this.cityService.getCityOrCreate(dto.city.toUpperCase())
    const [company, created] = await this.companyRepository.findOrCreate({
      where: { inn: dto.inn },
      defaults: { ...dto,  city: dto.city.toUpperCase(), reviews_count: 0, rating: 0, related_companies: [] }
    })
    if (created) {
      await this.cacheManager.set('image-company:' + company.id, true, { ttl: 600 })
      await this.companySearchService.indexCompany(company);
      await this.cityService.addCompanyToCity(company);
    } else {
      await this.companySearchService.updateCompany(company)
    }
    return company ?? ''
  }


  async createCompany(dto: CompanyDto) {
    console.log(dto);
    let company: CompanyModel;
    await this.cityService.getCity(dto.city.toUpperCase())
    company = await this.companyRepository.create({ ...dto, city: dto.city.toUpperCase(), reviews_count: 0, rating: 0, related_companies: [] });
    await this.cacheManager.set('image-company:' + company.id, true, { ttl: 600 })
    await this.companySearchService.indexCompany(company);
    await this.cityService.addCompanyToCity(company);
    return company;
  }

  async getCompanyPageById(id: number) {
    const company: CompanyModel = await this.companyRepository.findByPk(id, { include: [{ model: ReviewModel }] });
    if (!company) {
      throw new CompanyNotfoundException([{
        field: 'company',
        errors: ['No company with this id!']
      }]);
    }
    const transformed = {
      ...company.toJSON(),
      company_reviews: company.company_reviews.filter((r) => !r.archive).map((r) => r.getPublicData(company))
    }
    return transformed;
  }

  async getCompanyById(id: number) {
    const company: CompanyModel = await this.companyRepository.findByPk(id, { include: [{ model: ReviewModel }] });
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
    // if (!dto.query || dto.query === '') {
    //   ids = (await this.cityService.getCompaniesByCity(dto.city, dto.page)).map((c) => c.id);
    // }
    if (dto.query && dto.query !== '') {
      const results = await this.companySearchService.search(dto.query, dto.page);
      ids = results.map(result => result.id);
    }
    if (!ids.length) {
      return [];
    }

    const where: SearchRequestСonvert = {
      id: { [Op.in]: ids },
      city: dto.city,
      type: dto.type
    };
    if (!dto.city) {
      delete where.city;
    }
    if (!dto.type) {
      delete where.type;
    }
    const found_companies = (await this.companyRepository.findAll({
      where: where,
      include: [{ model: ReviewModel }],
      limit: 10, offset: (dto.page - 1) * 10
      // order: [['rating', 'DESC']],
    })).map((c) => c.getSearchData());

    const query_companies = (await this.companyRepository.findAll({ where: { [Op.and]: [{ id: parseInt(dto.query) || -1 }, { id: { [Op.notIn]: found_companies.map((r) => r.id) } }] } }) ?? []).map((c) => c.getSearchData())
    return [...query_companies, ...found_companies]
  }


  async searchInput(dto: Omit<SearchCompanyDto, 'page'>) {
    let ids = [];
    const results = await this.companySearchService.search(dto.query, 1);
    ids = results.map(result => result.id);
    if (!ids.length) {
      return [];
    }
    const where = {
      id: { [Op.in]: ids },
      city: dto.city,
      type: dto.type
    };
    if (!dto.city) delete where['city']
    if (!dto.type) delete where['type']
    // if (dto.city) where.city = dto.city
    // if (dto.type) where.type = dto.type

    const found_companies = (await this.companyRepository.findAll({
      where: where,
      include: [{ model: ReviewModel }],
      limit: 10
    })).map((c) => c.getSearchData());
    const query_companies = (await this.companyRepository.findAll({ where: { [Op.and]: [{ id: parseInt(dto.query) || -1 }, { id: { [Op.notIn]: found_companies.map((r) => r.id) } }] } }) ?? []).map((c) => c.getSearchData())

    return [...query_companies, ...found_companies]
  }

  async bindCompany(dto: BindCompanyDto) {
    const company1 = await this.companyRepository.findByPk(dto.company1_id);
    if (!company1) {
      throw new CompanyNotfoundException([{
        field: 'company1',
        errors: ['No company 1 with this id!']
      }]);
    }
    const company2 = await this.companyRepository.findByPk(dto.company2_id);
    if (!company2) {
      throw new CompanyNotfoundException([{
        field: 'company2',
        errors: ['No company 2 with this id!']
      }]);
    }
    if (company1.related_companies.find((c) => c.id === company2.id)) {
      throw new ValidationException([{
        field: 'company',
        errors: ['Companies is already bound']
      }]);
    }

    await this.companyRepository.update({ related_companies: [...company1.related_companies, company2] }, { where: { id: company1.id } })
    await this.companyRepository.update({ related_companies: [...company2.related_companies, company1] }, { where: { id: company2.id } })

    return { bind: true };
  }

  async unbindCompany(dto: BindCompanyDto) {
    const company1 = await this.companyRepository.findByPk(dto.company1_id);
    if (!company1) {
      throw new CompanyNotfoundException([{
        field: 'company1',
        errors: ['No company 1 with this id!']
      }]);
    }
    const company2 = await this.companyRepository.findByPk(dto.company2_id);
    if (!company2) {
      throw new CompanyNotfoundException([{
        field: 'company2',
        errors: ['No company 2 with this id!']
      }]);
    }
    if (!company1.related_companies.find((c) => c.id === company2.id)) {
      throw new ValidationException([{
        field: 'company',
        errors: ['Companies is not bound']
      }]);
    }
    company1.related_companies.splice(company1.related_companies.findIndex((c) => c.id === company2.id), 1)
    company2.related_companies.splice(company2.related_companies.findIndex((c) => c.id === company1.id), 1)
    const company1Related = JSON.parse(JSON.stringify(company1.related_companies))
    const company2Related = JSON.parse(JSON.stringify(company2.related_companies))
    await this.companyRepository.update({ related_companies: company1Related}, { where: {
        id: company1.id
    } });

    await this.companyRepository.update({ related_companies: company2Related}, {
      where: {
        id: company2.id
      }
    });

    return { unbind: true };
  }

  async updateCompany(dto: UpdateCompanyDto) {
    const company = await this.companyRepository.findByPk(dto.company_id, { include: [{ model: ReviewModel }] });
    if (!company) {
      throw new CompanyNotfoundException([{
        field: 'company',
        errors: ['No company with this id!']
      }]);
    }
    const updateData = UpdateCompanyDto.transformUpdateData(dto, company);
    return await company.update(updateData);
  }

  async getDadataAddress(dto: string[]) {
    return (await this.httpService.post<DadataAddressResponse[]>('https://cleaner.dadata.ru/api/v1/clean/address', JSON.stringify(dto), {
      headers: {
        'Authorization': 'Token ' + process.env.DADATA_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Secret': process.env.DADATA_SECRET_KEY
      }
    }).toPromise()).data
  }

  async getDadataAddressTips(dto: string[]) {
    return (await this.httpService.post<DadataAddressResponse[]>('https://cleaner.dadata.ru/api/v1/clean/address', JSON.stringify(dto), {
      headers: {
        'Authorization': 'Token ' + process.env.DADATA_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Secret': process.env.DADATA_SECRET_KEY
      }
    }).toPromise()).data
  }

  async pushImageToCompany(dto: UploadCompanyImageDto, image: any) {
    const id = parseInt(dto.company_id)
    const company = await this.companyRepository.findByPk(id)
    if (!company) {
      throw new CompanyNotfoundException([{
        field: 'id',
        errors: ['No companies with this id']
      }])
    }
    const allowToUpload = await this.cacheManager.get('image-company:' + company.id)
    if (!allowToUpload || company.image) throw new ValidationException([
      {
        field: 'image',
        errors: ['You are not allowed to upload images']
      }
    ])

    await this.cacheManager.del('image-company:' + company.id)

    const imageUrl = await this.filesService.createFile(image)
    await company.update({ image: imageUrl })

    return {
      uploaded: true
    }
  }

  async getAllById(params: object) {
    return this.companyRepository.findAll(params)
  }

  async countRatingAndReviews(id: number) {
    const company = await this.companyRepository.findByPk(id)
    const company_reviews = await company.$get('company_reviews')
    let company_rating = 0
    let length = 0
    for (const r of company_reviews) {
      if (!r.archive) {
        length++
        company_rating += r.rating;
      }
    }
    company_rating = company_rating / length
    await company.update({
      reviews_count: length,
      rating: company_rating
    })
  }
}
