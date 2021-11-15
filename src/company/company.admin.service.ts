import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CompanyModel } from './company.model';
import { ReviewModel } from '../review/review.model';
import { CityService } from '../city/city.service';
import { CompanySearchService } from './company-search.service';
import { CompanyNotfoundException } from '../exceptions/company-notfound.exception';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { FilesService } from '../files/files.service';
import { CompanyAdminDto } from '../admin/dto/company.dto';
import { UploadCompanyImageAdminDto } from '../admin/dto/edit-review.dto';
import { Op } from 'sequelize';

@Injectable()
export class CompanyAdminService {
  constructor(@InjectModel(CompanyModel) private companyRepository: typeof CompanyModel,
              private readonly cityService: CityService,
              private readonly companySearchService: CompanySearchService,
              private httpService: HttpService,
              private filesService: FilesService,
              @Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

  async getCompany(id: number) {
    const company: CompanyModel = await this.companyRepository.findByPk(id, { include: [{ model: ReviewModel }] });
    if (!company) {
      throw new CompanyNotfoundException([{
        field: 'company',
        errors: ['No company with this id!']
      }]);
    }
    const transformed = {
      ...company.toJSON(),
      company_reviews: company.company_reviews.filter((r) => !r.archive).map((r) => r.getAdminData(company))
    };
    return transformed;
  }

  async updateCompanyAdmin(dto: CompanyAdminDto) {
    const company = await this.companyRepository.findByPk(dto.id);
    if (!company) {
      throw new CompanyNotfoundException([{
        field: 'id',
        errors: ['No companies with this id']
      }]);
    }

    const updated = await company.update(dto);

    const related_companies = await this.companyRepository.findAll({ where: { id: { [Op.in]: updated.related_companies.map((c) => c.id) } } });

    for (const related_company of related_companies) {
      const related_inner = related_company.related_companies;
      related_inner[related_inner.findIndex((c) => c.id === updated.id)] = updated;
      await this.companyRepository.update({
        related_companies: related_inner
      }, { where: { id: related_company.id } });
    }

    return updated;
  }

  async addImageToCompanyByAdmin(dto: UploadCompanyImageAdminDto, image: any) {
    const id = parseInt(dto.company_id);
    const company = await this.companyRepository.findByPk(id);
    if (!company) {
      throw new CompanyNotfoundException([{
        field: 'id',
        errors: ['No companies with this id']
      }]);
    }

    let updated = null;

    if (!image) {
      if (company.image) {
        await this.filesService.deleteFile(company.image);
      }
      updated = await company.update({
        image: null
      });
    } else {
      const imageUrl = await this.filesService.createFile(image);
      if (company.image) {
        await this.filesService.deleteFile(company.image);
      }
      updated = await company.update({
        image: imageUrl
      });
    }


    const related_companies = await this.companyRepository.findAll({ where: { id: { [Op.in]: updated.related_companies.map((c) => c.id) } } });

    for (const related_company of related_companies) {
      const related_inner = related_company.related_companies;
      related_inner[related_inner.findIndex((c) => c.id === updated.id)] = updated;
      await this.companyRepository.update({
        related_companies: related_inner
      }, { where: { id: related_company.id } });
    }

    return {
      uploaded: true
    };
  }

  async deleteImageFromCompanyByAdmin(dto: UploadCompanyImageAdminDto) {
    const company = await this.companyRepository.findByPk(dto.company_id);
    if (!company) {
      throw new CompanyNotfoundException([{
        field: 'id',
        errors: ['No companies with this id']
      }]);
    }

    let updated = null;

    if (company.image) {
      await this.filesService.deleteFile(company.image);
      updated = await company.update({
        image: null
      });
      const related_companies = await this.companyRepository.findAll({ where: { id: { [Op.in]: updated.related_companies.map((c) => c.id) } } });

      for (const related_company of related_companies) {
        const related_inner = related_company.related_companies;
        related_inner[related_inner.findIndex((c) => c.id === updated.id)] = updated;
        await this.companyRepository.update({
          related_companies: related_inner
        }, { where: { id: related_company.id } });
      }
    }


    return {
      deleted: true
    };
  }
}
