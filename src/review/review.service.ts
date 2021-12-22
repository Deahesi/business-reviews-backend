import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ReviewModel } from './review.model';
import { CreateReviewDto, CreateReviewWithCompanyDto, UploadImageDto } from './dto/create-review.dto';
import { CompanyService } from '../company/company.service';
import { CompanyModel } from '../company/company.model';
import { CompanyNotfoundException } from '../exceptions/company-notfound.exception';
import { ValidationException } from '../exceptions/validation.exception';
import { FilesService } from '../files/files.service';
import { Cache } from 'cache-manager';
import { log } from 'util';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(ReviewModel) private reviewRepository: typeof ReviewModel,
              private companyService: CompanyService,
              private filesService: FilesService,
              @Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

  async createReview(dto: CreateReviewDto) {
    let company: CompanyModel
    company = await this.companyService.getCompanyById(dto.company_id)
    if (!company) {
      throw new CompanyNotfoundException([{
        field: 'company',
        errors: ['No company with this id!']
      }])
    }

    console.log('Validated company 1');
    const review = await this.reviewRepository.create({ ...dto, images: [], company_id: company.id, archive: false, company_name: company.name })
    console.log('Created review 2');
    await this.cacheManager.set('image:' + review.id, true, { ttl: 600 })
    console.log('Setted cache 3');
    await this.companyService.countRatingAndReviews(company.id)
    console.log('Counted reviews 4');

    return review.getPublicData(company)
  }

  async findById(id: number) {
    const review = await this.reviewRepository.findByPk(id)
    if (!review || review.archive === true) {
      throw new CompanyNotfoundException([{
        field: 'id',
        errors: ['No reviews with this id']
      }])
    }
    return review.getPublicData()
  }

  async getPageData(id: number) {
    const review = await this.reviewRepository.findByPk(id)
    if (!review || review.archive === true) {
      throw new CompanyNotfoundException([{
        field: 'id',
        errors: ['No reviews with this id']
      }])
    }
    const company = await this.companyService.getCompanyById(review.company_id)
    return review.getFullPublicData(company)
  }

  async getLastReviews(page_number: number) {
    if (page_number < 1) {
      throw new ValidationException([{
        field: 'page_number',
        errors: ['Invalid page number']
      }])
    }
    const reviews = await this.reviewRepository.findAll({ where: {archive: false}, limit: 5, offset: (page_number - 1) * 5, order: [['createdAt', 'DESC']], include: [{ model: CompanyModel }] })
    return reviews.map((r) => r.getPublicData(r.company))
  }

  async createReviewWithCompany(dto: CreateReviewWithCompanyDto) {
    const company = await this.companyService.createCompany({ ...dto.company })
    const review = await this.createReview({ ...dto, company_id: company.id })
    return review
  }

  async getCompanyReviews(id: number) {
    const company = await this.companyService.getCompanyById(id)
    if (!company) {
      throw new CompanyNotfoundException([{
        field: 'company',
        errors: ['No companies with this id']
      }])
    }
    const reviews = await this.reviewRepository.findAll({ where: { company_id: id, archive: false } })
    return reviews.map((r) => r.getPublicData())
  }

  async uploadImage(dto: UploadImageDto, image: any) {
    const id = parseInt(dto.review_id)
    const review = await this.reviewRepository.findByPk(id)
    if (!review || review.archive === true) {
      throw new CompanyNotfoundException([{
        field: 'id',
        errors: ['No reviews with this id']
      }])
    }
    const allowToUpload = await this.cacheManager.get('image:' + review.id)
    if (!allowToUpload || review.images.length > 4) throw new ValidationException([
      {
        field: 'image',
        errors: [!allowToUpload ? 'You are not allowed to upload images' : 'Images count cannot be bigger than 3']
      }
    ])

    if (Boolean(parseInt(dto.last)) || review.images.length > 4) await this.cacheManager.del('image:' + review.id)

    const imageUrl = await this.filesService.createFile(image)
    await review.update({
      images: [...review.images, imageUrl]
    })

    return {
      uploaded: true
    }
  }

  async getAllReviewsId() {
    return await this.reviewRepository.findAll({ attributes: ['id'] })
  }
}
