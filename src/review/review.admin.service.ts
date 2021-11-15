import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ReviewModel } from './review.model';
import { CompanyService } from '../company/company.service';
import { CompanyType } from '../company/company.model';
import { FilesService } from '../files/files.service';
import { Cache } from 'cache-manager';
import { CompanySearchService } from '../company/company-search.service';
import { SearchAdminDto } from '../admin/dto/search-admin.dto';
import { Op } from 'sequelize';
import { CompanyNotfoundException } from '../exceptions/company-notfound.exception';
import { DeleteImageAdminDto, UploadImageAdminDto } from '../admin/dto/edit-review.dto';
import { ValidationException } from '../exceptions/validation.exception';

class SearchRequestСonvert {
  id?: object;
  city?: string;
  type?: CompanyType;
}

@Injectable()
export class ReviewAdminService {
  constructor(@InjectModel(ReviewModel) private reviewRepository: typeof ReviewModel,
              private companyService: CompanyService,
              private filesService: FilesService,
              private readonly searchCompanyService: CompanySearchService,
              @Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

  private async searchLayout(dto: SearchAdminDto) {
    const ids = (await this.searchCompanyService.search(dto.query, dto.page)).map((c) => parseInt(c.id));
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

    return where
  }

  async search(dto: SearchAdminDto) {
    const where = await this.searchLayout(dto)

    const company_reviews = ((await this.companyService.getAllById({
      where: where,
      include: [{ model: ReviewModel }]
    })).map((c) => c.getAdminSearchData())).flat().filter((r) => !r.archive);
    const query_reviews = (await this.reviewRepository.findAll({ where: { [Op.and]: [{ id: parseInt(dto.query) || -1 }, { id: { [Op.notIn]: company_reviews.map((r) => r.id) } }] } }) ?? []).flat().filter((r) => !r.archive);
    return [...query_reviews, ...company_reviews];
  }

  async searchArchive(dto: SearchAdminDto) {
    const where = await this.searchLayout(dto)

    const company_reviews = ((await this.companyService.getAllById({
      where: where,
      include: [{ model: ReviewModel }]
    })).map((c) => c.getAdminSearchData())).flat().filter((r) => r.archive);
    const query_reviews = (await this.reviewRepository.findAll({ where: { [Op.and]: [{ id: parseInt(dto.query) || -1 }, { id: { [Op.notIn]: company_reviews.map((r) => r.id) } }] } }) ?? []).flat().filter((r) => r.archive);
    return [...query_reviews, ...company_reviews];
  }

  async updateReviewAdmin(id: number, fields: object) {
    const review = await this.reviewRepository.findByPk(id);
    if (!review) {
      throw new CompanyNotfoundException([{
        field: 'id',
        errors: ['No reviews with this id']
      }]);
    }

    const updated = await review.update(fields);
    await this.companyService.countRatingAndReviews(review.company_id)
    return updated
  }

  async findByIdAdmin(id: number) {
    const review = await this.reviewRepository.findByPk(id);
    if (!review) {
      throw new CompanyNotfoundException([{
        field: 'id',
        errors: ['No reviews with this id']
      }]);
    }
    return review;
  }

  async findAllByIdsAdmin(ids: number[]) {
    const reviews = await this.reviewRepository.findAll({ where: { id: {[Op.in]: ids } } });
    if (!reviews.length) {
      throw new CompanyNotfoundException([{
        field: 'ids',
        errors: ['No reviews with this ids']
      }]);
    }
    return reviews;
  }

  async addImageToReviewByAdmin(dto: UploadImageAdminDto, image: any) {
    const id = parseInt(dto.review_id);
    const review = await this.reviewRepository.findByPk(id);
    if (!review) {
      throw new CompanyNotfoundException([{
        field: 'id',
        errors: ['No reviews with this id']
      }]);
    }

    if (review.images.length > 4) {
      throw new ValidationException([
        {
          field: 'image',
          errors: ['Images count cannot be bigger than 5']
        }
      ]);
    }

    const imageUrl = await this.filesService.createFile(image);
    await review.update({
      images: [...review.images, imageUrl]
    });

    return {
      uploaded: true
    };
  }

  async deleteImageToReviewByAdmin(dto: DeleteImageAdminDto) {
    const review = await this.reviewRepository.findByPk(dto.review_id);
    if (!review) {
      throw new CompanyNotfoundException([{
        field: 'id',
        errors: ['No reviews with this id']
      }]);
    }

    const updatedImages = [];

    for (const image of review.images) {
      const found = dto.image_urls.find((url) => url === image)
      if (found) {
        await this.filesService.deleteFile(image);
      } else {
        updatedImages.push(image);
      }
    }


    return await review.update({
      images: updatedImages
    })
  }
}
